<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\SellerInfo;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        return response()->json(Product::with(['category', 'seller'])->get());
    }

    public function show($id)
    {
        $product = Product::with(['category', 'seller'])->find($id);
        if (!$product) {
            return response()->json(['message' => 'Sản phẩm không tồn tại'], 404);
        }
        return response()->json($product);
    }
    public function myProducts()
    {
        $user = Auth::user();
        if ($user->RoleID !== 2) {
            return response()->json(['message' => 'Chỉ seller mới có quyền truy cập'], 403);
        }

        $products = Product::with(['category', 'variants'])
            ->where('SellerID', $user->UserID)
            ->get();

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'ProductName' => 'required|string|max:200',
            'Description' => 'nullable|string|max:500',
            'Gender' => 'required|in:Male,Female,Unisex',
            'CategoryID' => 'required|exists:ProductCategory,CategoryID',
            'Price' => 'nullable|numeric|min:0',
            'Thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'SellerID' => 'nullable|exists:Users,UserID',
        ]);

        $sellerID = $user->RoleID === 1
            ? $request->input('SellerID')
            : $user->UserID;

        if (!$sellerID) {
            return response()->json(['message' => 'Cần cung cấp SellerID'], 422);
        }

        if ($user->RoleID !== 1 && !SellerInfo::where('SellerID', $user->UserID)->exists()) {
            return response()->json(['message' => 'Bạn chưa có thông tin nhãn hàng'], 403);
        }

        if ($request->hasFile('Thumbnail')) {
            $image = $request->file('Thumbnail');
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/product'), $filename);
            $validated['ThumbnailURL'] = url('images/product/' . $filename);
        }

        $validated['SellerID'] = $sellerID;
        $validated['Status'] = 'Pending';

        $product = Product::create($validated);

        // ✅ Xử lý biến thể nếu có
        foreach ($request->input('variants', []) as $index => $variantData) {
            $variant = [
                'ProductID' => $product->ProductID,
                'SizeID' => $request->input("variants.$index.SizeID"),
                'ColorID' => $request->input("variants.$index.ColorID"),
                'Price' => $request->input("variants.$index.Price"),
                'StockQuantity' => $request->input("variants.$index.StockQuantity"),
            ];

            // ✅ Xử lý ảnh biến thể
            if ($request->hasFile("variants.$index.Image")) {
                $file = $request->file("variants.$index.Image");
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('images/productv2'), $filename);
                $variant['ImageURL'] = url('images/productv2/' . $filename);
            }

            ProductVariant::create($variant);
        }

        return response()->json($product->load(['variants']), 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        $user = Auth::user();

        if (!$product) {
            return response()->json(['message' => 'Sản phẩm không tồn tại'], 404);
        }

        // ✅ Admin thì được sửa tất cả. Seller chỉ sửa sản phẩm của mình.
        if ($user->RoleID !== 1 && $product->SellerID !== $user->UserID) {
            return response()->json(['message' => 'Không có quyền sửa sản phẩm này'], 403);
        }

        $validated = $request->validate([
            'ProductName' => 'sometimes|string|max:200',
            'Description' => 'nullable|string|max:500',
            'Gender' => 'in:Male,Female,Unisex',
            'CategoryID' => 'exists:ProductCategory,CategoryID',
            'Price' => 'nullable|numeric|min:0',
            'Thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('Thumbnail')) {
            if ($product->ThumbnailURL) {
                $oldPath = public_path(parse_url($product->ThumbnailURL, PHP_URL_PATH));
                if (File::exists($oldPath)) {
                    File::delete($oldPath);
                }
            }

            $image = $request->file('Thumbnail');
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/product'), $filename);
            $validated['ThumbnailURL'] = url('images/product/' . $filename);
        }

        $product->update($validated);
        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::find($id);
        $user = Auth::user();

        if (!$product) {
            return response()->json(['message' => 'Sản phẩm không tồn tại'], 404);
        }

        // ✅ Admin xoá được hết. Seller chỉ xoá sản phẩm của mình.
        if ($user->RoleID !== 1 && $product->SellerID !== $user->UserID) {
            return response()->json(['message' => 'Không có quyền xoá sản phẩm này'], 403);
        }

        $product->delete();
        return response()->json(['message' => 'Đã xoá sản phẩm']);
    }
}
