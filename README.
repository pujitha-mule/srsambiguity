# Severity-Aware Ambiguity Detection and Requirement Quality Assessment in Software Requirement Specifications

## Overview
Software Requirement Specification (SRS) documents play an important role in software development by defining system requirements clearly for developers, stakeholders, and project managers. However, requirements written in natural language often contain ambiguity, which can lead to misunderstanding, incorrect implementation, project delays, and increased development cost.

This project presents a rule-based ambiguity detection system for analyzing SRS documents and identifying unclear or imprecise requirement statements. The system detects ambiguity indicators such as vague words, subjective expressions, unclear quantities, and optional conditions, and assigns severity levels based on an ambiguity scoring mechanism.

The project provides a web-based platform where users can upload SRS documents and receive detailed ambiguity analysis reports with sentence-level detection and suggestions for improving requirement clarity.

---

# Features

- Upload SRS documents in PDF or DOCX format
- Extract and preprocess textual content
- Detect ambiguity indicators using rule-based NLP techniques
- Classify ambiguity into multiple categories
- Assign severity levels (High, Medium, Low)
- Generate sentence-level ambiguity reports
- Provide suggestions for improving unclear requirements
- Display document-level ambiguity summary and health score

---

# Ambiguity Indicators

The system identifies the following ambiguity types:

| Ambiguity Type | Description |
|---|---|
| Vague Words | Terms with unclear meaning such as *fast*, *quickly*, *efficient* |
| Subjective Expressions | Terms based on personal interpretation such as *user-friendly*, *high quality* |
| Quantitative Ambiguity | Unclear numerical references such as *many users*, *several requests* |
| Optional Conditions | Modal verbs indicating uncertainty such as *may*, *might*, *can* |

---

# Ambiguity Scoring Mechanism

Each ambiguity indicator contributes to the total ambiguity score:

| Indicator | Score |
|---|---|
| Vague Word | +1 |
| Subjective Expression | +2 |
| Quantitative Ambiguity | +2 |
| Optional Indicator | +1 |

Severity levels are assigned based on the total score:

| Score Range | Severity |
|---|---|
| 4 or more | High Ambiguity |
| 2 – 3 | Medium Ambiguity |
| 1 | Low Ambiguity |

---

# System Architecture

The system follows a layered architecture consisting of:

## Presentation Layer
- ReactJS frontend
- User-friendly interface for document upload and report visualization

## Application Layer
- Flask backend
- NLP processing using NLTK and spaCy
- Rule-based ambiguity detection engine

## Data Layer
- MongoDB database
- Stores uploaded documents and ambiguity analysis results

---

# Technologies Used

## Frontend
- ReactJS
- HTML
- CSS

## Backend
- Python
- Flask

## NLP Libraries
- NLTK
- spaCy

## Database
- MongoDB

---

# Workflow

1. User uploads an SRS document
2. Text extraction module retrieves textual content
3. Preprocessing module cleans and segments sentences
4. Ambiguity detection module analyzes requirement statements
5. Scoring mechanism calculates ambiguity severity
6. Results are displayed through summary and sentence-level reports

---

# Example

### Input Requirement
> “The system should support many users and may respond quickly.”

### Detected Ambiguities
- **many** → Quantitative Ambiguity
- **may** → Optional Condition
- **quickly** → Vague Expression

### Total Score
4 Points

### Severity
High Ambiguity

---

# Experimental Results

The system was evaluated using Software Requirement Specification (SRS) statements containing both ambiguous and non-ambiguous requirements.

Performance Metrics:

| Metric | Value |
|---|---|
| Accuracy | 88.5% |
| Precision | 62.4% |
| Recall | 48.7% |
| F1-Score | 54.6% |

The results indicate that the rule-based approach performs effectively for identifying explicit ambiguity patterns while maintaining interpretable and practical outputs for requirement analysis.

---

# Advantages

- Helps identify unclear requirements early
- Improves requirement quality and readability
- Supports requirement prioritization using severity levels
- Reduces manual effort in ambiguity analysis
- Provides scalable analysis for large SRS documents

---

# Limitations

- Rule-based detection may miss context-dependent ambiguity
- Limited capability for semantic understanding
- Performance depends on predefined linguistic patterns

---

# Future Enhancements

- Integration of machine learning techniques
- Use of transformer-based contextual language models
- Automated requirement rewriting suggestions
- Enhanced semantic ambiguity detection

---

# Conclusion

This project demonstrates a rule-based ambiguity detection system for Software Requirement Specification documents using Natural Language Processing and ambiguity scoring techniques. The system assists requirement engineers in identifying explicit ambiguity patterns and improving requirement clarity during the early stages of software development.

Future improvements involving machine learning and contextual language models can further enhance ambiguity detection performance and overall system reliability.

---

# Authors

- Lingamgunta Vaishnavi
- A Jayasree
- Pujitha Mule
- Dr. Siddique Ibrahim S P

School of Computer Science and Engineering  
VIT-AP University  
Amaravati, Andhra Pradesh

---
