<?php

namespace modules\sitemodule;

use Craft;
use yii\base\Event;
use yii\base\Module as BaseModule;
use craft\elements\Entry;
use craft\helpers\ElementHelper;
use craft\helpers\MoneyHelper;

use Aws\S3\S3Client;

/**
 * site-module module
 *
 * @method static Module getInstance()
 */
class Module extends BaseModule
{
    public function init(): void
    {
        Craft::setAlias('@modules/sitemodule', __DIR__);

        // Set the controllerNamespace based on whether this is a console or web request
        if (Craft::$app->request->isConsoleRequest) {
            $this->controllerNamespace = 'modules\\sitemodule\\console\\controllers';
        } else {
            $this->controllerNamespace = 'modules\\sitemodule\\controllers';
        }

        parent::init();

        $this->attachEventHandlers();

        // Any code that creates an element query or loads Twig should be deferred until
        // after Craft is fully initialized, to avoid conflicts with other plugins/modules
        Craft::$app->onInit(function() {
            // ...
        });
    }

    private function attachEventHandlers(): void
    {

        // todo If entry deleted or updated
        // todo If entry inactive


        Event::on(
            \craft\services\Elements::class,
            \craft\services\Elements::EVENT_AFTER_SAVE_ELEMENT,
            function (\craft\events\ElementEvent $event) {
                if (!($event->element instanceof Entry) ||
                    ElementHelper::isDraft($event->element) ||
                    $event->element->section->handle !== 'products') {
                    return;
                }

                $productEntries = Entry::find()
                    ->section('products')
                    ->all();

                $products = [];

                foreach ($productEntries as $entry) {
                    $products[] = [
                        "id" => $entry->id,
                        "name" => $entry->productName,
                        "price" => MoneyHelper::toNumber($entry->productPrice),
                        "categories" => array_map(
                            fn($c) => $c->title,
                            $entry->productCategory->all()
                        )
                    ];
                }

                $productsJson = json_encode($products, JSON_PRETTY_PRINT);

                if (Craft::$app->config->env === 'production') {
                    $s3 = new S3Client([
                        'region'      => 'auto',
                        'endpoint'    => 'https://fly.storage.tigris.dev',
                        'version'     => 'latest',
                        'credentials' => [
                            'key'    => getenv('TIGRIS_ACCESS_KEY_ID'),
                            'secret' => getenv('TIGRIS_SECRET_ACCESS_KEY'),
                        ],
                    ]);

                    $key = "public/products.json";

                    try {
                        $s3->putObject([
                            'Bucket'      => getenv('TIGRIS_BUCKET'),
                            'Key'         => $key,
                            'Body'        => $productsJson,
                            'ContentType' => 'application/json',
                            'ACL'         => 'public-read',
                        ]);
                        Craft::info("Uploaded {$key} to Tigris S3.", __METHOD__);
                    } catch (\Exception $e) {
                        Craft::error("Failed to upload {$key}: " . $e->getMessage(), __METHOD__);
                    }
                } else {
                    file_put_contents(
                        Craft::getAlias('@root') . '/storage/runtime/temp/products.json',
                        $productsJson,
                    );
                }
            }
        );
    }
}
