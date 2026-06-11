# Database Design: EduAI Platform

This document outlines the Entity-Relationship (ER) model for the EduAI platform, based on the requirements for student management, AI tutors per subject, and simulated exams.

## Entity-Relationship Diagram

```mermaid
erDiagram
    STUDENT ||--o{ ENROLLMENT : has
    SUBJECT ||--o{ ENROLLMENT : includes
    SUBJECT ||--|| AI_AGENT : "has tutor"
    SUBJECT ||--o{ EXAM : "offers tests"
    STUDENT ||--o{ EXAM_ATTEMPT : takes
    EXAM ||--o{ EXAM_ATTEMPT : "is taken in"
    EXAM ||--o{ QUESTION : contains
    QUESTION ||--o{ OPTION : has
    EXAM_ATTEMPT ||--o{ ANSWER : records
    EXAM_ATTEMPT ||--o{ IMPROVEMENT_AREA : generates
    QUESTION ||--o{ ANSWER : for
    STUDENT ||--o{ CHAT_SESSION : participates
    AI_AGENT ||--o{ CHAT_SESSION : interacts
    CHAT_SESSION ||--o{ MESSAGE : contains

    STUDENT {
        uuid id PK
        string email UK
        string password
        string first_name
        string last_name
        string school
        string grade_level
        string avatar_url
        enum plan_type "free | premium"
        int tokens_balance
        int streak_count
        datetime last_login_at
        datetime created_at
    }

    SUBJECT {
        uuid id PK
        string name
        string description
        string icon_name "Material symbol name"
        string color_theme "Hex or tailwind class"
        int total_lessons
    }

    ENROLLMENT {
        uuid id PK
        uuid student_id FK
        uuid subject_id FK
        int completed_lessons
        string status "active | completed"
        datetime enrolled_at
    }

    AI_AGENT {
        uuid id PK
        uuid subject_id FK "Each subject has 1 agent"
        string name
        string model_id "gemini-pro | gpt-4"
        text system_prompt
        string avatar_url
    }

    EXAM {
        uuid id PK
        uuid subject_id FK
        string title
        text description
        int time_limit_minutes
        int total_points
        string difficulty "easy | medium | hard"
    }

    QUESTION {
        uuid id PK
        uuid exam_id FK
        text content
        enum type "multiple_choice | true_false"
        int points
    }

    OPTION {
        uuid id PK
        uuid question_id FK
        text content
        boolean is_correct
    }

    EXAM_ATTEMPT {
        uuid id PK
        uuid student_id FK
        uuid exam_id FK
        int score
        int time_spent_seconds
        text ai_feedback_summary
        datetime started_at
        datetime completed_at
    }

    IMPROVEMENT_AREA {
        uuid id PK
        uuid attempt_id FK
        string topic_name
        string priority "low | moderate | high"
        text ai_suggestion
    }

    ANSWER {
        uuid id PK
        uuid attempt_id FK
        uuid question_id FK
        uuid selected_option_id FK
        text text_content "For open questions if needed"
    }

    CHAT_SESSION {
        uuid id PK
        uuid student_id FK
        uuid agent_id FK
        datetime last_interaction
    }

    MESSAGE {
        uuid id PK
        uuid session_id FK
        enum sender "student | agent"
        text content
        datetime sent_at
    }
```

## Key Considerations

1.  **AI Tutor Integration**: Each `SUBJECT` has a dedicated `AI_AGENT`. This agent acts as the tutor for all students enrolled in that subject.
2.  **Tracking Progress (Help Areas)**: By analyzing `EXAM_ATTEMPT` scores and `MESSAGE` content in `CHAT_SESSION`, the system can identify specific topics where a student needs more help.
3.  **Simulated Exams**: The `EXAM`, `QUESTION`, and `OPTION` entities allow for the creation of structured mock tests. `EXAM_ATTEMPT` tracks the performance history relative to real-world presence exams.
4.  **Hexagonal Architecture**: These entities will be implemented in the `apps/backend/src/domain/entities` layer to keep the business logic pure and decoupled from the persistence layer (TypeORM).
