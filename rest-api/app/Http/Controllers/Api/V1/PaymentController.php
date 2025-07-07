<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    //  Xem thông tin thanh toán theo đơn hàng
    public function showByOrder($orderId)
    {
        $payment = Payment::where('OrderID', $orderId)
            ->with('order')
            ->first();

        if (!$payment) {
            return response()->json(['message' => 'Không tìm thấy thanh toán cho đơn hàng này'], 404);
        }

        if (Auth::user()->RoleID !== 1 && $payment->order->UserID !== Auth::id()) {
            return response()->json(['message' => 'Không có quyền truy cập thanh toán này'], 403);
        }

        return response()->json($payment);
    }

    //  Tạo thanh toán cho đơn hàng

    public function store(Request $request)
    {
        $validated = $request->validate([
            'OrderID' => 'required|exists:Orders,OrderID',
            'PaymentMethod' => 'required|string|max:50',
        ]);

        $order = Order::with('user')->find($validated['OrderID']);

        if (!$order || $order->UserID !== auth()->id()) {
            return response()->json(['message' => 'Không có quyền thanh toán cho đơn hàng này'], 403);
        }

        if (Payment::where('OrderID', $order->OrderID)->exists()) {
            return response()->json(['message' => 'Đơn hàng đã được thanh toán hoặc đang xử lý'], 409);
        }

        $payment = Payment::create([
            'OrderID' => $order->OrderID,
            'PaymentMethod' => $validated['PaymentMethod'],
            'PaymentStatus' => 'Completed',
            'PaidAt' => now(),
        ]);


        $order->update(['Status' => 'Paid']);

        return response()->json([
            'message' => 'Thanh toán thành công',
            'payment' => $payment
        ], 201);
    }




    //  Admin cập nhật trạng thái thanh toán
    public function update(Request $request, $id)
    {
        $this->middleware('admin');

        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['message' => 'Không tìm thấy thanh toán'], 404);
        }

        $validated = $request->validate([
            'PaymentStatus' => 'required|string|max:50',
        ]);

        $payment->update($validated);
        return response()->json([
            'message' => 'Đã cập nhật trạng thái thanh toán',
            'payment' => $payment
        ]);
    }

    // Admin xác nhận thanh toán
    public function confirm(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->RoleID !== 1) {
            return response()->json(['message' => 'Bạn không có quyền thực hiện thao tác này'], 403);
        }

        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['message' => 'Không tìm thấy thanh toán'], 404);
        }

        $payment->update([
            'PaymentStatus' => 'Completed',
            'PaidAt' => now(),
        ]);

        $order = Order::find($payment->OrderID);
        if ($order && $order->Status === 'Pending') {
            $order->update(['Status' => 'Paid']);
        }

        return response()->json([
            'message' => 'Xác nhận thanh toán thành công',
            'payment' => $payment,
        ]);
    }
}
