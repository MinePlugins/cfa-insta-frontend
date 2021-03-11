export class Product {
    public static fromJson(json: Object): Product {
        return new Product(
            json['id'],
            json['name'],
            json['category'],
            json['price'],
            json['unit'],
            json['availability'],
            json['sale'],
            json['discount'],
            json['comments'],
            json['owner'],
            json['quantity_sales'],
            json['stock'],
            )
    }

    constructor(public id: number,
                public name: string,
                public category: number,
                public price: number,
                public unit: string,
                public availability: boolean,
                public sale: boolean,
                public discount: number,
                public comments: string,
                public owner: string,
                public quantity_sales: number,
                public stock: number,
                ) {
    }
}