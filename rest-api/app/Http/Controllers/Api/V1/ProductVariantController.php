<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductVariantController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        return response()->json(ProductVariant::with(['product', 'size', 'color'])->get());
    }

    public function show($id)
    {
        $variant = ProductVariant::with(['product', 'size', 'color'])->find($id);
        if (!$variant) {
            return response()->json(['message' => 'Không tìm thấy biến thể'], 404);
        }
        return response()->json($variant);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'ProductID' => 'required|exists:Product,ProductID',
            'SizeID' => 'nullable|exists:Size,SizeID',
            'ColorID' => 'nullable|exists:Color,ColorID',
            'Price' => 'required|numeric|min:0',
            'StockQuantity' => 'required|integer|min:0',
            'Image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        // Check quyền seller
        if ($user->RoleID !== 1) {
            $productOwner = Product::where('ProductID', $validated['ProductID'])
                ->where('SellerID', $user->UserID)
                ->exists();

            if (!$productOwner) {
                return response()->json(['message' => 'Bạn không có quyền thêm biến thể cho sản phẩm này'], 403);
            }
        }

        if ($request->hasFile('Image')) {
            $image = $request->file('Image');
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/productv2'), $filename);
            $validated['ImageURL'] = url('images/productv2/' . $filename);
        }

        $variant = ProductVariant::create($validated);
        return response()->json($variant, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        $user = Auth::user();

        if (!$product) return response()->json(['message' => 'Sản phẩm không tồn tại'], 404);
        if ($user->RoleID !== 1 && $product->SellerID !== $user->UserID)
            return response()->json(['message' => 'Không có quyền sửa'], 403);

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
                if (File::exists($oldPath)) File::delete($oldPath);
            }

            $image = $request->file('Thumbnail');
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/product'), $filename);
            $validated['ThumbnailURL'] = url('images/product/' . $filename);
        }

        $product->update($validated);

        // ✅ Xử lý biến thể mới
        foreach ($request->input('variants', []) as $index => $variantData) {
            $request->validate([
                "variants.$index.SizeID" => 'nullable|exists:Size,SizeID',
                "variants.$index.ColorID" => 'nullable|exists:Color,ColorID',
                "variants.$index.Price" => 'required|numeric|min:0',
                "variants.$index.StockQuantity" => 'required|integer|min:0',
                "variants.$index.Image" => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);

            $variant = new ProductVariant([
                'ProductID' => $product->ProductID,
                'SizeID' => $variantData['SizeID'] ?? null,
                'ColorID' => $variantData['ColorID'] ?? null,
                'Price' => $variantData['Price'],
                'StockQuantity' => $variantData['StockQuantity'],
            ]);

            if ($request->hasFile("variants.$index.Image")) {
                $file = $request->file("variants.$index.Image");
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('images/productv2'), $filename);
                $variant->ImageURL = url('images/productv2/' . $filename);
            }

            $variant->save();
        }


        return response()->json($product->load(['variants']));
    }
    public function getTotalStock(Request $request)
    {
        $productId = $request->query('ProductID');

        $query = ProductVariant::query();

        if ($productId) {
            $query->where('ProductID', $productId);
        }

        $totalStock = $query->sum('StockQuantity');

        return response()->json([
            'ProductID' => $productId,
            'TotalStock' => $totalStock
        ]);
    }

    public function destroy($id)
    {
        $user = auth()->user();
        $variant = ProductVariant::find($id);

        if (!$variant) {
            return response()->json(['message' => 'Không tìm thấy biến thể'], 404);
        }

        if ($user->RoleID !== 1) {
            $ownProduct = Product::where('ProductID', $variant->ProductID)
                ->where('SellerID', $user->UserID)
                ->exists();

            if (!$ownProduct) {
                return response()->json(['message' => 'Bạn không có quyền xoá biến thể này'], 403);
            }
        }

        $variant->delete();
        return response()->json(['message' => 'Đã xoá biến thể']);
    }
}
