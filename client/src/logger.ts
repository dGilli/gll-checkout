export default function Logger() {
    this.url = "/log"
    this.info = info
    this.error = error
    this.log = log
}
export const log = async (level: string, ...message: string[]) => {
    const combinedMsg = [`${level.toUpperCase()}:`, ...message].join(" ")
    if (import.meta.env.MODE === 'development') {
        if (level === "error") {
            console.error(combinedMsg)
        } else {
            console.log(combinedMsg)
        }
    } else {
        try {
            const resp = await fetch("/url", {
                method: "POST",
                body: combinedMsg,
            });
            if (!resp.ok) {
                throw new Error(`Response status: ${resp.status}`);
            }
        } catch (error) {
            console.log(combinedMsg)
            console.error("Logging request failed:", error);
       }
    }
}
export const info = (...message: string[]) => log("info", ...message)
export const error = (...message: string[]) => log("error", ...message)
export const logger = new Logger()
