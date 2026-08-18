// import { Injectable, signal, computed } from '@angular/core';

// export interface CartBook {
//   id: string;
//   title: string;
//   author?: string;
//   price: number;
//   image?: string;
// }

// @Injectable({
//   providedIn: 'root'
// })

// export class Cart {

//   private readonly cartKey = 'bookverse_cart';

//   private readonly cartSignal = signal<CartBook[]>(
//     this.loadCart()
//   );

//   readonly cart = this.cartSignal.asReadonly();

//   readonly cartCount = computed(() =>
//     this.cartSignal().length
//   );

//   addToCart(book: CartBook): void {

//     const currentCart = this.cartSignal();

//     const alreadyExists = currentCart.some(
//       item => item.id === book.id
//     );

//     if (alreadyExists) {
//       return;
//     }

//     const updatedCart = [
//       ...currentCart,
//       book
//     ];

//     this.cartSignal.set(updatedCart);

//     localStorage.setItem(
//       this.cartKey,
//       JSON.stringify(updatedCart)
//     );
//   }

//   removeFromCart(id: string): void {

//     const updatedCart =
//       this.cartSignal().filter(
//         item => item.id !== id
//       );

//     this.cartSignal.set(updatedCart);

//     localStorage.setItem(
//       this.cartKey,
//       JSON.stringify(updatedCart)
//     );
//   }

//   clearCart(): void {

//     this.cartSignal.set([]);

//     localStorage.removeItem(
//       this.cartKey
//     );
//   }

//   isInCart(id: string): boolean {
//     return this.cartSignal().some(
//       item => item.id === id
//     );
//   }

//   private loadCart(): CartBook[] {

//     const cart = localStorage.getItem(
//       this.cartKey
//     );

//     if (!cart) {
//       return [];
//     }

//     try {
//       return JSON.parse(cart);
//     } catch {
//       return [];
//     }
//   }
// }
import { Injectable, computed, signal } from '@angular/core';

export interface CartBook {
  id: string;
  title: string;
  author?: string;
  price: number;
  image?: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly cartKey = 'bookverse_cart';

  private readonly cartSignal = signal<CartBook[]>(
    this.loadCart()
  );

  readonly cart = this.cartSignal.asReadonly();

  readonly cartCount = computed(() =>
    this.cartSignal().reduce(
      (total, item) => total + item.quantity,
      0
    )
  );

  // readonly subtotal = computed(() =>
  //   this.cartSignal().reduce(
  //     (total, item) =>
  //       total + (item.price * item.quantity),
  //     0
  //   )
  // );


  readonly subtotal = computed(() =>
    this.cartSignal().reduce(
      (total, item) =>
        total + (Number(item.price) * item.quantity),
      0
    )
  );

// ----------------------------------
// CHARGES
// ----------------------------------

readonly deliveryCharge = computed(() =>
  this.round(this.subtotal() * 0.02)
);

readonly handlingCharge = computed(() =>
  this.round(this.subtotal() * 0.01)
);

readonly convenienceCharge = computed(() =>
  this.round(this.subtotal() * 0.01)
);

readonly packagingCharge = computed(() =>
  this.round(this.subtotal() * 0.01)
);

readonly sgstCharge = computed(() =>
  this.round(this.subtotal() * 0.025)
);

readonly cgstCharge = computed(() =>
  this.round(this.subtotal() * 0.025)
);


// ----------------------------------
// FINAL TOTAL
// ----------------------------------

readonly total = computed(() => {

  const total =
    this.subtotal() +
    this.deliveryCharge() +
    this.handlingCharge() +
    this.convenienceCharge() +
    this.packagingCharge() +
    this.sgstCharge() +
    this.cgstCharge();

  return this.round(total);
});


getTotal(): number {
  return this.total();
}

// ----------------------------------
// ROUND MONEY
// ----------------------------------

private round(value: number): number {
  return Math.round(value * 100) / 100;
}


  addToCart(book: Omit<CartBook, 'quantity'>): void {

    const currentCart = this.cartSignal();

    const existingBook = currentCart.find(
      item => item.id === book.id
    );

    let updatedCart: CartBook[];

    if (existingBook) {

      updatedCart = currentCart.map(item =>
        item.id === book.id
          ? {
            ...item,
            quantity: item.quantity + 1
          }
          : item
      );

    } else {

      updatedCart = [
        ...currentCart,
        {
          ...book,
          quantity: 1
        }
      ];

    }

    this.saveCart(updatedCart);
  }

  increaseQuantity(id: string): void {

    const updatedCart = this.cartSignal().map(item =>
      item.id === id
        ? {
          ...item,
          quantity: item.quantity + 1
        }
        : item
    );

    this.saveCart(updatedCart);
  }

  decreaseQuantity(id: string): void {

    const updatedCart = this.cartSignal()
      .map(item =>
        item.id === id
          ? {
            ...item,
            quantity: item.quantity - 1
          }
          : item
      )
      .filter(item => item.quantity > 0);

    this.saveCart(updatedCart);
  }

  removeFromCart(id: string): void {

    const updatedCart =
      this.cartSignal().filter(
        item => item.id !== id
      );

    this.saveCart(updatedCart);
  }

  clearCart(): void {

    this.cartSignal.set([]);

    localStorage.removeItem(
      this.cartKey
    );
  }

  isInCart(id: string): boolean {
    return this.cartSignal().some(
      item => item.id === id
    );
  }

  //  readonly total = computed(() =>
  //   this.cartSignal().reduce(
  //     (total, item) =>
  //       total + (Number(item.price) * item.quantity),
  //     0
  //   )
  // );


  // getTotal(): number {
  //   return this.total();
  // }





  private saveCart(cart: CartBook[]): void {

    this.cartSignal.set(cart);

    localStorage.setItem(
      this.cartKey,
      JSON.stringify(cart)
    );
  }

  private loadCart(): CartBook[] {

    const cart =
      localStorage.getItem(this.cartKey);

    if (!cart) {
      return [];
    }

    try {

      const parsed = JSON.parse(cart);

      return parsed.map((item: any) => ({
        ...item,
        quantity: item.quantity ?? 1
      }));

    } catch {

      return [];
    }
  }
}