<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ProductClickTracking;
use Illuminate\Http\Request;

class ProductClickTrackingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->only(['store']);
    }

    //  Ghi nhận click vào sản phẩm
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ProductID' => 'required|exists:Product,ProductID',
            'SourcePage' => 'nullable|string|max:100',
        ]);

        ProductClickTracking::create([
            'UserID' => auth()->id(),
            'ProductID' => $validated['ProductID'],
            'SourcePage' => $validated['SourcePage'] ?? null,
            'ClickedAt' => now(),
        ]);

        return response()->json(['message' => 'Đã ghi nhận click sản phẩm'], 201);
    }

    //  Admin: Top sản phẩm được click nhiều nhất
    public function topClicked()
    {
        $data = ProductClickTracking::selectRaw('ProductID, COUNT(*) as TotalClicks')
            ->groupBy('ProductID')
            ->orderByDesc('TotalClicks')
            ->with('product')
            ->limit(10)
            ->get();

        return response()->json($data);
    }
}
