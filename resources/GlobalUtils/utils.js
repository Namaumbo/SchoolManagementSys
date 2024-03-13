class Utils {
    constructor(){}
     wordNormalizer(word) {
        if (typeof word === "string") {
            word = word.trim();
            word = word.replace(/[^a-zA-Z\s]/g, "");
            return word.toUpperCase();
        } else {
            throw new Error("Input is not a string");
        }
    }
}
export default new Utils();
