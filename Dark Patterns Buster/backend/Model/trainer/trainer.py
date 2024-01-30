import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from catboost import CatBoostClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, confusion_matrix, roc_curve, auc, precision_recall_curve, average_precision_score
import seaborn as sns
import matplotlib.pyplot as plt
import os

# Read the dataset
df = pd.read_csv('../dataset.tsv', sep="\t", encoding="utf-8")
map = {j: i for i, j in enumerate(df['Pattern Category'].unique())}
df1 = df.drop(columns=['page_id', 'label'])

# Split the dataset
X_train, X_test, Y_train, Y_test = train_test_split(df1['text'], df1['Pattern Category'], test_size=0.3)

# Vectorize the text data
vect = TfidfVectorizer(max_features=100, lowercase=True)
x_train = vect.fit_transform(X_train)
y_train = Y_train.map(map)
y_test = Y_test.map(map)

# Train models
rfc = RandomForestClassifier()
rfc.fit(x_train, y_train)
x_test = vect.transform(X_test)
preds_rfc = rfc.predict(x_test)

cbc = CatBoostClassifier()
cbc.fit(x_train, y_train)
preds_cbc = cbc.predict(x_test)

svc = SVC()
svc.fit(x_train, y_train)
preds_svc = svc.predict(x_test)

# Create directories for saving models and images
models_dir = '../saved_model'
images_dir = '../model_metrics'
if not os.path.exists(models_dir):
    os.makedirs(models_dir)

if not os.path.exists(images_dir):
    os.makedirs(images_dir)

# Save models
with open("../saved_model/svc.pkl", "wb") as f:
    pickle.dump(svc, f)
with open("../saved_model/rfc.pkl", "wb") as f:
    pickle.dump(rfc, f)
with open("../saved_model/cbc.pkl", "wb") as f:
    pickle.dump(cbc, f)

# Save Confusion Matrix
cm_rfc = confusion_matrix(y_test, preds_rfc)
plt.figure()
sns.heatmap(cm_rfc, annot=True, fmt='d', cmap='Blues')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix - Random Forest Classifier')
plt.savefig(os.path.join(images_dir, 'confusion_matrix_rfc.png'))

# Save ROC Curve for Multiclass
y_test_bin = pd.get_dummies(y_test)  # Convert to binary format
probs_rfc = rfc.predict_proba(x_test)

# Ensure y_test_bin and probs_rfc have the same number of samples
if y_test_bin.shape[0] == probs_rfc.shape[0]:
    # Calculate ROC curve
    fpr_rfc = dict()
    tpr_rfc = dict()
    roc_auc_rfc = dict()

    for i in range(y_test_bin.shape[1]):
        fpr_rfc[i], tpr_rfc[i], _ = roc_curve(y_test_bin.iloc[:, i], probs_rfc[:, i])
        roc_auc_rfc[i] = auc(fpr_rfc[i], tpr_rfc[i])

    # Plot ROC curve
    plt.figure()
    for i in range(y_test_bin.shape[1]):
        plt.plot(fpr_rfc[i], tpr_rfc[i], lw=2, label=f'ROC curve (area = {roc_auc_rfc[i]:.2f}) for class {i}')

    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver Operating Characteristic - Random Forest Classifier (Multiclass)')
    plt.legend(loc='lower right')
    plt.savefig(os.path.join(images_dir, 'roc_curve_rfc.png'))

    if hasattr(rfc, 'feature_importances_'):
        feature_importance = rfc.feature_importances_
        feature_names = vect.get_feature_names_out()
        feature_importance_df = pd.DataFrame({'Feature': feature_names, 'Importance': feature_importance})
        feature_importance_df = feature_importance_df.sort_values(by='Importance', ascending=False)

        plt.figure(figsize=(12, 6))
        sns.barplot(x='Importance', y='Feature', data=feature_importance_df.head(10))  # Top 10 features
        plt.title('Top 10 Feature Importances')
        plt.savefig(os.path.join(images_dir, 'feature_importance.png'))

    # Model Comparison Bar Plot
    models = ['Random Forest', 'CatBoost', 'SVM']
    accuracies = [accuracy_score(preds_rfc, y_test), accuracy_score(preds_cbc, y_test), accuracy_score(preds_svc, y_test)]

    plt.figure()
    sns.barplot(x=accuracies, y=models, palette='viridis')
    plt.xlabel('Accuracy')
    plt.ylabel('Models')
    plt.title('Model Comparison - Accuracy')
    plt.savefig(os.path.join(images_dir, 'model_comparison.png'))


    print(f'Accuracy of RFC: {accuracies[0]}, Accuracy of CatBoost: {accuracies[1]}, Accuracy of SVM: {accuracies[2]}')
else:
    print("Number of samples in y_test_bin and probs_rfc do not match.")
