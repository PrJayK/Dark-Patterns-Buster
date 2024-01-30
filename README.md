# Dark-Patterns-Buster

Dark Patterns Buster exposes hidden website tactics and empowers you to make informed choices online.

## How to Install

1. Clone the directory locally.
2. In the browser, go to the extensions page and enable `Developer Mode`.
3. Click on `Load Unpacked` and select the directory containing the `manifest.json` file.
4. The extension should now appear in the list of installed extensions.

## Metrics of Machine Learning Model

### Confusion Matrix of all 7 Classes

![Confusion Matrix](/Dark%20Patterns%20Buster/backend/Model/model_metrics/confusion_matrix_rfc.png)

**Comments:**

- The confusion matrix provides an overview of the model's performance across all 7 classes.
- Analyzing the diagonal elements helps understand how well the model is performing for each class.
- Consider further analysis and adjustments to improve model accuracy.

### Feature Importance Plot

![Feature Importance](/Dark%20Patterns%20Buster/backend/Model/model_metrics/feature_importance.png)

**Comments:**

- The feature importance plot illustrates the significance of different features in the machine learning model.
- Identify the most influential features for making predictions.

### Model Comparison Bar Plot

![Model Comparison](/Dark%20Patterns%20Buster/backend/Model/model_metrics/model_comparison.png)

**Comments:**

- The bar plot compares the accuracy of different models, including Random Forest, CatBoost, and SVM.
- Evaluate the performance of each model and choose the most suitable one for your task.

### ROC Curve

![ROC Curve](/Dark%20Patterns%20Buster/backend/Model/model_metrics/roc_curve_rfc.png)

**Comments:**

- The ROC curve visualizes the trade-off between true positive rate and false positive rate.
- AUC (Area Under the Curve) provides a measure of the model's ability to distinguish between classes.
- Aim for a curve that is closer to the top-left corner for better performance.

