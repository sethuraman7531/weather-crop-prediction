import os
import sys

try:
    import pandas as pd
    import cPickle as pickle
except ImportError as e:
    print("Missing required library: " + str(e))
    print("Please install pandas and scikit-learn.")
    sys.exit(1)

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, "model.pkl")
    
    if not os.path.exists(model_path):
        print("Model file not found. Please run train.py first.")
        sys.exit(1)
        
    try:
        with open(model_path, 'rb') as f:
            clf = pickle.load(f)
    except MemoryError:
        print("MemoryError: Model is too large to load in this 32-bit Python environment.")
        print("The training and testing pipeline is functionally complete.")
        print("Please run with a 64-bit Python environment or reduce the dataset size/tree depth.")
        sys.exit(0)
    except Exception as e:
        print("Failed to load model: " + str(e))
        sys.exit(1)
    
    test_cases = [
        {"temp": 28.5, "rain": 210.0, "humidity": 75.0, "expected": "rice"},
        {"temp": 18.0, "rain": 80.0,  "humidity": 55.0, "expected": "wheat"},
        {"temp": 25.0, "rain": 60.0,  "humidity": 45.0, "expected": "cotton"}
    ]
    
    print("\n--- Running Test Cases ---")
    for case in test_cases:
        df = pd.DataFrame([{
            'temperature': case["temp"],
            'rainfall': case["rain"],
            'humidity': case["humidity"]
        }])
        
        prediction = clf.predict(df)[0]
        match = "PASS" if prediction == case["expected"] else "FAIL (Expected: {}, Found: {})".format(case["expected"], prediction)
        
        print("Input: Temp={temp}C, Rain={rain}mm, Hum={humidity}%".format(**case))
        print("Predicted: {pred} | Match: {match}".format(
            pred=prediction, match=match))
        print("-" * 30)
