<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    //  Lấy danh sách sản phẩm yêu thích
    public function index()
    {
        $items = Wishlist::with('product')
            ->where('UserID', auth()->id())
            ->orderByDesc('CreatedAt')
            ->get();

        return response()->json($items);
    }

    //  Thêm sản phẩm vào yêu thích
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ProductID' => 'required|exists:Product,ProductID',
        ]);

        $exists = Wishlist::where('UserID', auth()->id())
            ->where('ProductID', $validated['ProductID'])
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Sản phẩm đã có trong danh sách yêu thích'], 409);
        }

        $item = Wishlist::create([
            'UserID' => auth()->id(),
            'ProductID' => $validated['ProductID'],
        ]);

        return response()->json($item, 201);
    }

    //  Xoá sản phẩm khỏi danh sách yêu thích
    public function destroy($id)
    {
        $deleted = Wishlist::where('UserID', auth()->id())
            ->where('ProductID', $id)
            ->delete();

        return $deleted
            ? response()->json(['message' => 'Đã xoá khỏi danh sách yêu thích'])
            : response()->json(['message' => 'Không tìm thấy sản phẩm'], 404);
    }
}
