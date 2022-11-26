type Text = string | undefined | null | number;

export default class TextUtil {
    static get empty() {
        return "-";
    }

    private constructor() {
        /** */
    }

    static format(text: Text) {
        return TextUtil.isNull(text) ? "-" : `${text}`;
    }

    static isNull(text: string | undefined | null | number): boolean {
        return (
            text === "" ||
            text === undefined ||
            text === null ||
            (typeof text === "number" && Number.isNaN(text))
        );
    }

    static symbol(symbol: string) {
        return `${TextUtil.format(symbol)} ${symbol}`;
    }
}
