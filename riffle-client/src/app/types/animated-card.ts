import { Card } from "../../../../riffle-server/src/RiffleSchema";

export class AnimtatedCard {
    card: Card;
    x: number;
    y: number;
    velX: number;
    velY: number;
    stepsRemaining: number;

    get roundX(): number {
        return Math.round(this.x);
    }

    get roundY(): number {
        return Math.round(this.y);
    }

    get isFinished(): boolean {
        return this.stepsRemaining <= 0;
    }

    constructor(
        card: Card,
        srcX: number,
        srcY: number,
        destX: number,
        destY: number,
        steps: number,
    ) {
        this.card = card;
        this.x = srcX;
        this.y = srcY;
        this.velX = (destX - srcX) / steps;
        this.velY = (destY - srcY) / steps;
        this.stepsRemaining = steps;
    }

    public update(): void {
        this.x += this.velX;
        this.y += this.velY;
        this.stepsRemaining--;
    }
}