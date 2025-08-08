# AI Running Coach - Complete System Architecture

## Executive Summary

A serverless AI-powered running coach that provides personalized two-month rolling training plans, processes user feedback, and answers running-related questions. Built on free/low-cost services with intelligent LLM rate management, weekly plan updates, and coaching methodology integration.

## Core Objectives

1. **Two-Month Rolling Plan Management**: AI maintains current + next month's training plans with weekly updates
2. **Activity Feedback Processing**: Users log subjective feedback about runs to improve future planning
3. **General Running Guidance**: AI answers questions about training, nutrition, injury prevention, etc.

## System Architecture Overview

### High-Level Data Flow
```
User Profile (Always Visible) → Two-Month Rolling Plans → Weekly Performance Analysis → 
Plan Cascade Updates → Coaching Methodology Application → LLM Context → Response → Database Update
                                     ↓
                              Automated Jobs (Sunday night refresh, fitness updates)
                                     ↓
                              Background Processing (assumptions vs reality tracking)
```

## Database Architecture

### Core Entity Relationships
- **Users** → Multiple **Garmin Activities** (1:Many)
- **Garmin Activities** → One **Run Feedback** (1:1, optional)
- **Users** → One **Current Fitness Profile** (1:1)
- **Users** → Multiple **Fitness Snapshots** (1:Many, monthly)
- **Users** → Multiple **Two-Month Plans** (1:Many, rolling)
- **Users** → Multiple **Chat History** entries (1:Many)

### Data Storage Strategy

#### Primary Tables
1. **users** - Profile, goals, preferences, physical attributes, communication style, coaching methodology
2. **garmin_activities** - Objective run data from CSV import (streamlined columns)
3. **run_feedback** - Subjective user input (effort, recovery, motivation, notes)
4. **user_fitness_profile** - Current calculated fitness state (updated weekly)
5. **fitness_snapshots** - Monthly historical fitness records for trend analysis
6. **two_month_plans** - AI-generated rolling plans with weekly update tracking
7. **api_usage_tracking** - LLM rate limiting and usage monitoring
8. **chat_history** - Conversation context and debugging

#### Key Design Principles
- **Separation of Objective vs Subjective Data**: Garmin data separate from user feedback
- **Calculated vs Raw Data**: Fitness profiles derived from raw activities, not manually entered
- **Rolling Plan Management**: Two-month forward view with weekly cascading updates
- **Assumption-Based Tracking**: Assume completed unless Garmin data indicates otherwise
- **Coaching Methodology Integration**: Goal-based selection of training principles

### Data Processing Pipeline

#### Weekly Plan Refresh (Sunday Night)
**Triggers**: Every Sunday at 11 PM
**Process**:
1. Analyze previous week's performance (actual vs planned runs)
2. Update fitness profile based on completed workouts
3. Calculate cascade adjustments needed for remaining training
4. Regenerate two-month plan maintaining structure but adapting to performance
5. Apply appropriate coaching methodology based on current goals
6. Store plans with metadata tracking changes and assumptions

**Metrics Calculated**:
- Weekly performance vs planned workouts
- Fitness progression indicators
- Recovery and motivation trend scores
- Training load adjustments needed
- Coaching methodology effectiveness

#### Assumption vs Reality Tracking
**Logic**:
- **No Garmin Upload**: Assume all scheduled runs completed as planned
- **Partial Garmin Data**: Mix actual data with assumptions for missing days
- **Complete Garmin Data**: Use actual performance for all assessments
- **Late Uploads**: Retroactively update assumptions when data arrives

## API Architecture

### Endpoint Design Philosophy
- **RESTful where appropriate**: CRUD operations for standard entities
- **RPC-style for complex operations**: Chat interface, bulk imports, job triggers
- **Stateless design**: Each request contains all necessary context
- **Rate-aware**: All LLM-calling endpoints implement fallback logic
- **Real-time adaptivity**: Handle goal changes and plan adjustments immediately

### Core API Modules

#### 1. Authentication & User Management
```
POST /api/auth/register
POST /api/auth/login
GET  /api/users/profile
PUT  /api/users/profile
DELETE /api/users/account
```

#### 2. Activity Data Management
```
POST /api/activities/import-csv     # Bulk Garmin data import
GET  /api/activities               # Paginated activity list
GET  /api/activities/:id           # Single activity details
POST /api/activities/:id/feedback  # Add subjective feedback
PUT  /api/activities/:id/feedback  # Update feedback
DELETE /api/activities/:id         # Remove activity
```

#### 3. Fitness & Analytics
```
GET  /api/fitness/current          # Current fitness profile
GET  /api/fitness/snapshots        # Historical snapshots
GET  /api/fitness/trends           # Calculated trends and insights
POST /api/fitness/recalculate      # Manual fitness update trigger
```

#### 4. Two-Month Rolling Plans
```
GET  /api/plans/two-months         # Current + next month plans
GET  /api/plans/history           # Previous plan versions
POST /api/plans/regenerate        # Manual plan regeneration
GET  /api/plans/assumptions       # Show assumed vs confirmed runs
PUT  /api/plans/goal-change       # Handle mid-month goal transitions
```

#### 5. AI Chat Interface
```
POST /api/chat                    # Main conversation endpoint (includes profile updates)
GET  /api/chat/history           # Conversation history
DELETE /api/chat/history         # Clear history
POST /api/chat/goal-change       # Handle goal changes via chat
```

#### 6. System Operations (Internal)
```
POST /api/jobs/weekly-refresh     # Sunday night plan updates
POST /api/jobs/fitness-update     # Weekly fitness profile updates
POST /api/jobs/snapshots          # Monthly fitness snapshots
GET  /api/system/health          # System status
GET  /api/system/usage           # Rate limiting status
```

### Request/Response Patterns

#### Chat Endpoint Context Building
**Input**: User message + conversation type + current user state
**Process**:
1. Identify message intent (plan question, goal change, feedback, general question)
2. Gather comprehensive user context (profile, two-month plans, recent activities, fitness state)
3. Determine appropriate coaching methodology based on current goal
4. Build structured prompt with full context
5. Call LLM with rate management
6. Parse response for actionable data (goal changes, plan modifications)
7. Update database if needed (profile changes, plan adjustments)
8. Return formatted response with coaching methodology applied

**Context Data Included**:
- User profile (goals, constraints, preferences, communication style, coaching methodology)
- Current fitness profile (calculated metrics and trends)
- Two-month rolling plan (current + next month)
- Recent activities with feedback (last 20 runs)
- Assumption tracking (confirmed vs assumed completions)
- Previous goal changes and methodology transitions

#### Weekly Plan Refresh Processing
**Input**: All active users + previous week's performance data
**Process**:
1. For each user, analyze previous week (scheduled vs actual/assumed)
2. Update fitness profile based on completed workouts
3. Assess if cascade adjustments needed for remaining training
4. Apply appropriate coaching methodology (Daniels/Koop/Pfaff)
5. Regenerate two-month plan maintaining structure but adapting to performance
6. Track assumptions vs confirmed data
7. Store updated plans with change metadata
8. Handle any pending goal changes from week

## LLM Integration Architecture

### LLM Service Provider
**Platform**: awanllm.com API
**Free Tier Limits**: 
- 10 large model calls per day
- 200 small model calls per day  
- 20 calls per minute (total across both models)
**Upgrade Path**: Paid tier for higher limits as usage grows
**Implementation**: Database-tracked counters with automatic fallback

#### Intelligent Model Selection
1. **High Priority Requests** (weekly plan refresh, goal changes): Try large model first
2. **Medium Priority** (complex training questions): Use large if available, fallback to small
3. **Low Priority** (simple feedback, general questions): Use small model directly
4. **Fallback Chain**: Large → Small → Cached response → Error message

### Coaching Methodology Integration

#### Goal-Based Methodology Selection
- **5K to Marathon**: Jack Daniels methodology (VDOT-based training, structured intensity)
- **Ultra Marathon**: Jason Koop methodology (time-based training, back-to-back runs)
- **Sprint Training**: Dan Pfaff methodology (power development, technical focus)
- **General Fitness**: Default to Daniels approach with modifications

#### Prompt Engineering Strategy
**Context Templates**:
- **Plan Generation**: User profile + fitness snapshot + coaching methodology + previous plan analysis
- **Goal Change Assessment**: Current fitness + training history + new goal + methodology transition logic
- **Run Feedback**: Activity data + user input + recent training context + coaching methodology
- **General Questions**: User profile + relevant recent activities + question context + appropriate methodology

#### Response Generation Patterns
- **Methodology Application**: Invisible but consistent training principles
- **Coaching Language**: Adapt terminology and approach to methodology (VDOT vs time-based vs power)
- **Personalized Tone**: Communication style preferences (encouraging, direct, motivational)
- **Actionable Advice**: Specific recommendations based on methodology and user state

### Conversation Flow Management

#### Intent Recognition
1. **Goal Changes**: "train for marathon", "switch to ultras", "focus on speed"
2. **Plan Questions**: "too hard this week", "adjust my plan", "skip tomorrow"
3. **Feedback Processing**: "run felt hard", "great workout", "legs tired"
4. **General Questions**: "how to", "what is", "should I", methodology questions
5. **Profile Updates**: "I'm injured", "new PR", "schedule changed"

#### Goal Change Handling (Mid-Month)
**Process**:
1. **Immediate Assessment**: LLM analyzes current fitness + training history
2. **Methodology Transition**: Switch coaching approach (Daniels→Koop→Pfaff)
3. **Plan Recalculation**: Regenerate remaining month + next month
4. **Smooth Transition**: Avoid jarring changes, gradual methodology shift
5. **User Communication**: Explain transition approach and reasoning

## Automated Job Architecture

### Scheduling Strategy
**Platform**: Vercel Cron Jobs (free tier) or GitHub Actions
**Primary Job**: Sunday 11 PM weekly refresh
**Secondary Jobs**: Monthly snapshots, system maintenance

### Weekly Refresh Job Logic (Sunday Night)

#### Processing Flow
1. **User Batch Processing**: Handle all active users systematically
2. **Performance Analysis**: Compare previous week planned vs actual/assumed
3. **Fitness Profile Update**: Recalculate based on completed workouts
4. **Cascade Assessment**: Determine adjustments needed for remaining training
5. **Plan Regeneration**: Update two-month rolling plan with coaching methodology
6. **Assumption Tracking**: Update confirmed vs assumed completion records
7. **Goal Change Processing**: Handle any pending mid-month goal transitions
8. **Error Handling**: Log issues, continue processing other users

#### Coaching Methodology Application
- **Daniels**: VDOT-based pace zones, workout structure, progressive overload
- **Koop**: Time-based efforts, back-to-back training, ultra-specific adaptations
- **Pfaff**: Power development, speed-strength, technical movement patterns

### Job Reliability & Error Handling
- **Idempotent Operations**: Jobs can be safely re-run
- **Partial Failure Recovery**: Process users individually, don't fail entire batch
- **Rate Limit Awareness**: Distribute LLM calls across time to avoid limits
- **Monitoring**: Log job execution times, success rates, failure reasons
- **Fallback Logic**: Handle LLM failures gracefully with cached responses

## Frontend Architecture

### Technology Stack

#### Frontend
- **Framework**: Next.js with React
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context + Local State
- **Deployment**: Vercel (free tier initially, upgrade as needed)

#### Backend & API
- **API Framework**: Next.js API Routes (serverless functions)
- **Authentication**: NextAuth.js with JWT tokens
- **File Processing**: In-memory CSV parsing for Garmin imports
- **Rate Limiting**: Database-tracked counters for LLM usage

#### Database
- **Primary Option**: Supabase (PostgreSQL with free tier)
- **Alternative**: Railway PostgreSQL  
- **Features**: Connection pooling, automated backups, Row Level Security (RLS)
- **Real-time**: Supabase subscriptions for live updates

#### AI & LLM Integration
- **Provider**: awanllm.com API
- **Models**: Large and small model access with intelligent fallback
- **Rate Management**: 10 large/200 small daily calls, 20 per minute
- **Context Management**: Structured prompts with user data

#### Infrastructure & Deployment
- **Hosting**: Vercel serverless platform
- **Domain**: Custom domain support
- **SSL**: Automatic HTTPS certificates
- **CDN**: Built-in edge caching for static assets
- **Monitoring**: Vercel analytics and logging

#### Development Tools
- **Version Control**: Git with GitHub
- **Environment Management**: Vercel environment variables
- **Database Migrations**: SQL scripts with version control
- **API Testing**: Built-in Next.js development server

### Core User Interfaces

#### 1. Main Dashboard (Always Visible State)
- **User Profile Panel**: Goals, preferences, physical attributes (editable via chat)
- **Two-Month Calendar View**: Current + next month with completion tracking
- **Progress Analytics**: Weekly trends, pace progression, volume tracking
- **Quick Status**: Current fitness level, next scheduled workout
- **Assumption Indicators**: Show confirmed vs assumed run completions

#### 2. Chat Interface (Primary Interaction)
- **Conversation Flow**: Natural language for all interactions
- **Context Awareness**: References current plans, recent runs, goals
- **Goal Change Handling**: Seamless transitions with immediate plan updates
- **Methodology Awareness**: Can explain training approach if asked
- **Profile Updates**: Handle changes through natural conversation

#### 3. Data Management
- **CSV Upload**: Drag-and-drop Garmin data import with progress feedback
- **Activity List**: Comprehensive run history with feedback integration
- **Assumption Override**: Mark runs as missed or completed manually
- **Plan Visualization**: Weekly and monthly view with coaching rationale

#### 4. Plan Visualization & Tracking
- **Two-Month Calendar**: Visual plan layout with completion status
- **Workout Details**: Expandable cards with methodology-specific guidance
- **Progress Tracking**: Actual vs planned performance analysis
- **Coaching Context**: Show which methodology is being applied and why

### User Experience Patterns

#### Responsive Design
- **Mobile-First**: Primary interface optimized for phone use
- **Desktop Enhancement**: Larger screens show more context, side-by-side layouts
- **Progressive Enhancement**: Core features work without JavaScript

#### Real-Time Adaptivity
- **Goal Changes**: Immediate plan recalculation with smooth transitions
- **Performance Feedback**: Weekly adjustments visible in upcoming workouts
- **Assumption Tracking**: Clear indicators of confirmed vs assumed data
- **Coaching Consistency**: Methodology application visible in workout design

## Deployment & Infrastructure

### Hosting Strategy
**Platform**: Vercel (free tier initially, upgrade as needed)
**Benefits**: 
- Automatic deployments from Git
- Serverless functions for API routes
- Edge caching for static assets
- Built-in analytics and monitoring
- Easy scaling path

### Database Hosting
**Primary Option**: Supabase (free tier → Pro as needed)
**Alternative**: Railway PostgreSQL
**Configuration**:
- PostgreSQL with connection pooling
- Automated backups
- Real-time subscriptions for live updates
- Row Level Security (RLS)

### Environment Management
**Development**: Local PostgreSQL + local Next.js server
**Staging**: Vercel preview deployments + staging database
**Production**: Vercel production + production database

### Security Architecture

#### Authentication & Authorization
- **NextAuth.js**: Session management with JWT tokens
- **Database RLS**: Row-level security preventing data leakage
- **API Protection**: Rate limiting and input validation
- **Session Management**: Secure cookies, automatic expiration

#### Data Protection
- **Input Validation**: All user inputs validated and sanitized
- **SQL Injection Prevention**: Parameterized queries only
- **File Upload Security**: CSV validation, size limits, content scanning
- **Privacy Controls**: User data export and deletion capabilities

## Scalability & Performance

### Current Architecture Limits
**Database**: Free tier ~500MB-1GB storage, suitable for 50-100 active users
**API**: Vercel serverless limits sufficient for moderate usage
**LLM**: 200 daily calls limit growth to ~20-30 active users initially
**Upgrade Path**: Clear scaling strategy to paid tiers

### Performance Optimization Strategies

#### Database Performance
- **Indexing**: Optimized indexes for plan queries and activity lookups
- **Query Optimization**: Efficient queries for weekly refresh calculations
- **Connection Pooling**: Prevent database connection exhaustion
- **Caching**: Redis layer for frequently accessed data (future enhancement)

#### API Performance
- **Response Caching**: Cache static responses and plan data
- **Lazy Loading**: Load data incrementally in frontend
- **Batch Processing**: Group database operations to reduce round trips
- **CDN**: Static asset delivery through Vercel's edge network

### Future Scaling Considerations

#### Growth Path (50+ Users)
1. **Database Upgrade**: Move to paid tier for more storage/connections
2. **LLM Upgrade**: Paid tier for higher rate limits
3. **Caching Layer**: Add Redis for session and response caching
4. **Enhanced Monitoring**: Comprehensive logging and alerting

#### Advanced Features (100+ Users)
1. **Mobile App**: Native iOS/Android applications
2. **Direct API Integration**: Garmin/Strava automatic sync
3. **Advanced Analytics**: Injury prediction, performance forecasting
4. **Social Features**: Plan sharing, coach-athlete relationships

## Risk Management

### Technical Risks
1. **LLM Rate Limits**: Mitigation through intelligent fallback and caching
2. **Database Limits**: Monitoring with clear upgrade path
3. **Service Dependencies**: Backup plans for critical services
4. **Data Consistency**: Robust handling of assumption vs reality tracking

### Business Risks
1. **User Adoption**: Focus on core value proposition and coaching quality
2. **Scaling Costs**: Monitor usage patterns and optimize accordingly
3. **Coaching Accuracy**: Validate methodology application with domain experts
4. **Data Privacy**: Comprehensive privacy controls and transparency

## Success Metrics & KPIs

### Technical Metrics
- **Uptime**: >99% availability target
- **Performance**: <2s API response times, <1s page loads
- **Data Quality**: <1% failed fitness calculations, accurate plan generation
- **User Experience**: High chat response relevance, low error rates

### Coaching Effectiveness
- **Plan Adherence**: Users following generated training plans
- **Goal Achievement**: Success rate for stated objectives
- **Methodology Application**: Appropriate coaching technique selection
- **User Satisfaction**: Feedback on training quality and results

## Future Roadmap

### Phase 2 Enhancements (Months 3-6)
- **Advanced Analytics**: Injury risk prediction, performance trends
- **Wearable Integration**: Direct sync with Garmin, Apple Watch, etc.
- **Methodology Expansion**: Additional coaching approaches and specializations
- **Mobile App**: Native applications with offline capabilities

### Phase 3 Expansion (Months 6-12)
- **Multi-Sport Support**: Cycling, swimming, triathlon planning
- **Coach Marketplace**: Connect with human coaches for premium users
- **Social Features**: Training groups, plan sharing, community support
- **AI Enhancement**: Custom model fine-tuning for improved coaching

This architecture provides a solid foundation for an AI running coach that adapts weekly to user performance while maintaining consistent coaching methodology and two-month forward planning visibility.