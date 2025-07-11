<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\CartItem;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->only(['index', 'show', 'store']);
        $this->middleware('admin')->only(['destroy', 'adminIndex', 'update']);
    }

    //  Lấy danh sách đơn hàng của người dùng hiện tại
    public function index()
    {
        $orders = Order::with([
            'details.variant.product',
            'details.variant.size',
            'details.variant.color',
        ])
            ->where('UserID', auth()->id())
            ->orderByDesc('OrderDate')
            ->get();

        return response()->json($orders);
    }

    //  Lấy chi tiết đơn hàng
    public function show($id)
    {
        $order = Order::with([
            'details.variant.product',
            'details.variant.size',
            'details.variant.color',
        ])
            ->where('UserID', auth()->id())
            ->find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        return response()->json($order);
    }

    //  Tạo đơn hàng mới từ giỏ hàng
    public function store(Request $request)
    {
        $userId = auth()->id();
        $cartItems = CartItem::with('variant')->where('UserID', $userId)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Giỏ hàng đang trống'], 400);
        }

        $request->validate([
            'CouponCode' => 'nullable|string|max:50',
        ]);

        DB::beginTransaction();

        try {
            $total = 0;
            $details = [];
            $coupon = null;
            $discountAmount = 0;

            foreach ($cartItems as $item) {
                $variant = $item->variant;

                if (!$variant || $variant->StockQuantity < $item->Quantity) {
                    throw new \Exception("Biến thể '{$item->VariantID}' không đủ tồn kho");
                }

                $variant->StockQuantity -= $item->Quantity;
                $variant->save();

                $subtotal = $variant->Price * $item->Quantity;
                $total += $subtotal;

                $details[] = [
                    'VariantID' => $variant->VariantID,
                    'Quantity' => $item->Quantity,
                    'Price' => $variant->Price
                ];
            }

            if ($request->filled('CouponCode')) {
                $coupon = Coupon::where('Code', $request->CouponCode)
                    ->where('IsActive', true)
                    ->where('ExpirationDate', '>', now())
                    ->first();

                if (!$coupon) {
                    throw new \Exception('Mã giảm giá không hợp lệ hoặc đã hết hạn');
                }

                if ($total < $coupon->MinOrderValue) {
                    throw new \Exception('Đơn hàng chưa đủ giá trị tối thiểu để áp dụng mã giảm giá');
                }

                $discountAmount = $coupon->DiscountType === 'percentage'
                    ? $total * ($coupon->DiscountValue / 100)
                    : $coupon->DiscountValue;

                $discountAmount = min($discountAmount, $total);
                $total -= $discountAmount;
            }

            $order = Order::create([
                'UserID' => $userId,
                'CouponID' => $coupon->CouponID ?? null,
                'TotalAmount' => round($total, 2),
                'Status' => 'Pending', // Đợi thanh toán
            ]);

            foreach ($details as $detail) {
                $detail['OrderID'] = $order->OrderID;
                OrderDetail::create($detail);
            }

            CartItem::where('UserID', $userId)->delete();

            DB::commit();

            return response()->json([
                'message' => 'Đặt hàng thành công. Vui lòng tiến hành thanh toán.',
                'order' => $order->load('details.variant', 'coupon')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Không thể đặt hàng',
                'detail' => $e->getMessage()
            ], 500);
        }
    }



    //  Admin: Lấy tất cả đơn hàng
    public function adminIndex()
    {
        $orders = Order::with([
            'details.variant.product',
            'details.variant.size',
            'details.variant.color',
            'user'
        ])
            ->orderByDesc('OrderDate')
            ->get();

        return response()->json($orders);
    }

    //  Admin: Cập nhật đơn hàng
    public function update(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        $validated = $request->validate([
            'Status' => 'sometimes|string|max:50',
            'TotalAmount' => 'sometimes|numeric',
            'PaymentStatus' => 'nullable|string|max:50',
            'PaymentMethod' => 'nullable|string|max:50',
        ]);

        $order->update($validated);

        return response()->json([
            'message' => 'Cập nhật đơn hàng thành công',
            'order' => $order->fresh()
        ]);
    }

    //  Admin: Xoá đơn hàng
    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        DB::beginTransaction();
        try {
            OrderDetail::where('OrderID', $id)->delete();
            $order->delete();

            DB::commit();
            return response()->json(['message' => 'Đã xoá đơn hàng']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Lỗi khi xoá đơn hàng', 'detail' => $e->getMessage()], 500);
        }
    }
}
