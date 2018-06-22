export class StateEntry {
    key: String;
    extractor: any;
    positionGlobe: any;

    constructor(key: String, positiobGlobe: any, extractor: Function) {
      this.key = key;
      this.positionGlobe = positiobGlobe;
      this.extractor = extractor;
    }
}
