from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# In-memory data store
sku_msku_map = {}
current_id = 1

@app.route('/')
def home():
    return "Warehouse Management Backend Running!"

@app.route('/mappings', methods=['POST'])
def add_mapping():
    global current_id
    data = request.get_json()
    sku = data.get("sku")
    msku = data.get("msku")

    # ✅ Format Validation
    if not sku or not msku:
        return jsonify({"error": "Both 'sku' and 'msku' are required"}), 400

    if not re.match("^[a-zA-Z0-9\-]+$", sku):
        return jsonify({"error": "Invalid SKU format. Only letters, numbers, and hyphens allowed."}), 400

    if not re.match("^[a-zA-Z0-9\-]+$", msku):
        return jsonify({"error": "Invalid MSKU format. Only letters, numbers, and hyphens allowed."}), 400

    # ✅ Save to in-memory map
    sku_msku_map[current_id] = {"sku": sku, "msku": msku}
    current_id += 1

    # ✅ Log to file
    with open("mapping_log.txt", "a") as log_file:
        log_file.write(f"{sku} → {msku} added at {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    return jsonify({"message": "Mapping added successfully"}), 201

@app.route('/mappings', methods=['GET'])
def get_mappings():
    data = [{"id": k, "sku": v["sku"], "msku": v["msku"]} for k, v in sku_msku_map.items()]
    return jsonify(data)  # ✅ fixed spelling of 'return'

if __name__ == '__main__':
    app.run(debug=True)
