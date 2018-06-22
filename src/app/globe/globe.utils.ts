
export class GlobeUtils {
    private PI_2 = Math.PI * 2;
    constructor() {

    }

    normalizeRotation(rotation) {
        return {x: this.normalizeValue(rotation.x), y: this.normalizeValue(rotation.y)};
    }

    private normalizeValue(v) {
        if (v < 0) {
            return this.PI_2 + v;
        } else if (v > this.PI_2) {
            return v - this.PI_2;
        } else {
            return v;
        }
    }
}
