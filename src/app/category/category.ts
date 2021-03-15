export class Category {
    public static fromJson(json: Object): Category {
        return new Category(
            json['id'],
            json['name'],
            )
    }

    constructor(public id: number,
                public name: string,
                ) {
    }
}