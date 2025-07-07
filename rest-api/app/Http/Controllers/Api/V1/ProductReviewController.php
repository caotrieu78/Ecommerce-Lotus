<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;

class ProductReviewController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index']);
    }

    //  Lấy danh sách đánh giá của sản phẩm
    public function index($productId)
    {
        $reviews = ProductReview::with('user')
            ->where('ProductID', $productId)
            ->orderByDesc('CreatedAt')
            ->get();

        return response()->json($reviews);
    }

    // Gửi đánh giá sản phẩm
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ProductID' => 'required|exists:Product,ProductID',
            'Rating' => 'required|integer|between:1,5',
            'Comment' => 'nullable|string',
        ]);

        $exists = ProductReview::where('UserID', auth()->id())
            ->where('ProductID', $validated['ProductID'])
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Bạn đã đánh giá sản phẩm này'], 409);
        }

        $review = ProductReview::create([
            'UserID' => auth()->id(),
            ...$validated,
        ]);

        return response()->json($review, 201);
    }

    // 🗑 Xoá đánh giá (người viết hoặc admin)
    public function destroy($id)
    {
        $review = ProductReview::find($id);

        if (!$review) {
            return response()->json(['message' => 'Không tìm thấy đánh giá'], 404);
        }

        if ($review->UserID !== auth()->id() && auth()->user()->RoleID !== 1) {
            return response()->json(['message' => 'Bạn không có quyền xoá đánh giá này'], 403);
        }

        $review->delete();
        return response()->json(['message' => 'Đã xoá đánh giá']);
    }
}
