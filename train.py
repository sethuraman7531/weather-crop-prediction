import os
import sys

# For Python 2/3 compatibility and basic ML execution
try:
    import pandas as pd
    from sklearn.tree import DecisionTreeClassifier
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import accuracy_score
    import cPickle as pickle
except ImportError as e:
    print("Missing required library: " + str(e))
    print("Please install pandas and scikit-learn.")
    sys.exit(1)

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, "dataset", "crop_dataset.csv")
    
    print("Loading dataset from " + csv_path)
    df = pd.read_csv(csv_path)
    
    X = df[['temperature', 'rainfall', 'humidity']]
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training DecisionTreeClassifier...")
    clf = DecisionTreeClassifier(max_depth=15, random_state=42)
    clf.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print("Accuracy: {:.4f}".format(accuracy))
    
    model_path = os.path.join(current_dir, "model.pkl")
    with open(model_path, 'wb') as f:
        pickle.dump(clf, f)
    print("Model saved to " + model_path)
