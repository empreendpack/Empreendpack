import { useCart } from "@/contexts/CartContext";
import { X, ShoppingBag, Trash2, Plus, Minus, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import type { CartItem } from "@shared/commerce/types";

function formatMoney(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export default function CartDrawer() {
  const { cart, isOpen, closeCart, loading, updateQuantity, removeItem, proceedToCheckout, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer Panel */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col bg-[oklch(0.1_0.01_60)] border-l border-[oklch(0.22_0.02_60)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[oklch(0.22_0.02_60)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[oklch(0.78_0.12_75/0.12)] flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-[oklch(0.78_0.12_75)]" />
                </div>
                <div>
                  <h2 className="text-base font-semibold leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Seu Carrinho
                  </h2>
                  {itemCount > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">{itemCount} {itemCount === 1 ? "item" : "itens"}</p>
                  )}
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-[oklch(0.15_0.01_60)] transition-colors duration-200 group"
                aria-label="Fechar carrinho"
              >
                <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {loading && !cart && (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-6 h-6 animate-spin text-[oklch(0.78_0.12_75)]" />
                </div>
              )}

              {!loading && (!cart || cart.items.length === 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="flex flex-col items-center justify-center h-56 gap-4 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[oklch(0.13_0.01_60)] flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">Carrinho vazio</p>
                    <p className="text-muted-foreground text-xs mt-1">Adicione um pacote para começar</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="text-[oklch(0.78_0.12_75)] text-sm hover:underline flex items-center gap-1"
                  >
                    Ver pacotes <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}

              {cart && cart.items.length > 0 && (
                <ul className="space-y-3">
                  {cart.items.map((item: CartItem, idx: number) => (
                    <motion.li
                      key={item.lineId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.07, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      className="flex gap-4 p-4 rounded-2xl bg-[oklch(0.13_0.01_60)] border border-[oklch(0.22_0.02_60)] hover:border-[oklch(0.78_0.12_75/0.2)] transition-colors duration-200"
                    >
                      {item.image ? (
                        <img
                          src={item.image.url}
                          alt={item.image.altText ?? item.productTitle}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-[oklch(0.18_0.01_60)] flex items-center justify-center flex-shrink-0">
                          <ShoppingBag className="w-6 h-6 text-muted-foreground/40" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug">{item.productTitle}</p>
                        {item.variantTitle !== "Default Title" && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.variantTitle}</p>
                        )}
                        <p className="text-sm font-bold text-[oklch(0.78_0.12_75)] mt-1.5">
                          {formatMoney(item.unitPrice.amount, item.unitPrice.currencyCode)}
                        </p>
                        <div className="flex items-center gap-2 mt-2.5">
                          <button
                            onClick={() => updateQuantity(item.lineId, Math.max(0, item.quantity - 1))}
                            className="w-7 h-7 rounded-lg bg-[oklch(0.18_0.01_60)] flex items-center justify-center hover:bg-[oklch(0.22_0.02_60)] transition-colors active:scale-95"
                            disabled={loading}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center tabular-nums">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-[oklch(0.18_0.01_60)] flex items-center justify-center hover:bg-[oklch(0.22_0.02_60)] transition-colors active:scale-95"
                            disabled={loading}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.lineId)}
                            className="ml-auto p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                            disabled={loading}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <AnimatePresence>
              {cart && cart.items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="px-6 py-5 border-t border-[oklch(0.22_0.02_60)] space-y-4 bg-[oklch(0.09_0.01_60)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Subtotal</span>
                    <span className="text-foreground font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {formatMoney(cart.subtotal.amount, cart.subtotal.currencyCode)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[oklch(0.78_0.12_75/0.05)] border border-[oklch(0.78_0.12_75/0.15)]">
                    <ShoppingBag className="w-4 h-4 text-[oklch(0.78_0.12_75)] flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Entrega digital automática após o pagamento
                    </p>
                  </div>
                  <Button
                    onClick={proceedToCheckout}
                    disabled={loading}
                    className="w-full h-13 bg-[oklch(0.78_0.12_75)] hover:bg-[oklch(0.85_0.1_78)] text-[oklch(0.08_0.01_60)] font-bold text-base rounded-xl shadow-lg shadow-[oklch(0.78_0.12_75/0.2)] transition-all duration-200 active:scale-[0.98]"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Finalizar Compra <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
