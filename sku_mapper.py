# sku_mapper.py

import pandas as pd

#  Normal SKU → MSKU Mapping Dictionary
sku_to_msku = {
    "SKU001": "MSKU_A",
    "SKU002": "MSKU_B",
    "SKU003": "MSKU_C",
    
}

#  
combo_mapping = {
    "COMBO001": ["SKU001", "SKU002"],
    "COMBO002": ["SKU002", "SKU003"],

}

#  Mapping Function
def map_skus_to_mskus(df):
    expanded_rows = []

    for _, row in df.iterrows():
        sku = row["SKU"]
        qty = row.get("Qty", 1)  # Default Qty = 1

        
        if sku in combo_mapping:
            components = combo_mapping[sku]
            split_qty = qty / len(components)

            for comp_sku in components:
                expanded_rows.append({
                    "OriginalSKU": sku,
                    "SKU": comp_sku,
                    "Qty": split_qty,
                    "MSKU": sku_to_msku.get(comp_sku)
                })

        # Normal SKU
        else:
            expanded_rows.append({
                "OriginalSKU": sku,
                "SKU": sku,
                "Qty": qty,
                "MSKU": sku_to_msku.get(sku)
            })

    # Final DataFrame return
    return pd.DataFrame(expanded_rows)
