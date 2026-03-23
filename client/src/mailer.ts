import { logger } from "./logger"
export default function Mailer() {
    this.url = "/messages"
    this.send = send
}
export const send = async (data) => {
    logger.info("Sending email:", data.get("to"))
    if (import.meta.env.MODE === 'production') {
        try {
            const resp = await fetch("/messages", {
                method: "POST",
                body: data,
            })
            if (!resp.ok) {
                throw new Error(`Response status: ${resp.status}`)
            }
        } catch (error) {
            logger.error("Sending email failed:", error)
       }
    }
}
export const mailer = new Mailer()
