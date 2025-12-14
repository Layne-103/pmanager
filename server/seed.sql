-- Seed Data for Ticket Manager
-- This file contains 10 tags and 50 meaningful tickets
-- Run with: psql -d pmanager -f seed.sql

-- Clean existing data (optional - uncomment to reset)
-- TRUNCATE TABLE ticket_tags, tickets, tags RESTART IDENTITY CASCADE;

-- ============================================================================
-- TAGS (10 diverse tags)
-- ============================================================================

INSERT INTO tags (name, color) VALUES
-- Platform Tags
('iOS', '#147efb'),           -- Apple blue
('Android', '#3ddc84'),       -- Android green
('Web', '#f7df1e'),           -- JavaScript yellow
('Backend', '#68a063'),       -- Node green

-- Project/Process Tags
('Auto Release', '#8b5cf6'),  -- Purple
('Documentation', '#10b981'), -- Emerald
('CI/CD', '#f59e0b'),         -- Amber

-- Functional Tags
('Autocomplete', '#06b6d4'),  -- Cyan
('Bug', '#ef4444'),           -- Red
('Enhancement', '#3b82f6');   -- Blue

-- ============================================================================
-- TICKETS (50 meaningful tickets)
-- ============================================================================

-- iOS Platform Tickets (8 tickets)
INSERT INTO tickets (title, description, is_completed) VALUES
('Fix crash on iOS 17 when opening camera', 'App crashes immediately when user taps camera button on iOS 17 devices. Works fine on iOS 16 and below. Stack trace shows null pointer in AVCaptureSession.', false),
('Implement biometric authentication for iOS', 'Add Face ID and Touch ID support for secure login on iOS devices. Should fallback to PIN if biometric not available.', false),
('Optimize iOS app launch time', 'App takes 3-4 seconds to launch on older iPhone models. Need to reduce to under 2 seconds by lazy loading and optimizing initial view.', false),
('Fix iOS keyboard covering input fields', 'When keyboard appears, text input fields are hidden behind it. Need to adjust scroll view to keep active field visible.', true),
('Add iOS widget support', 'Create home screen widget showing recent tickets and quick actions. Should support all three widget sizes.', false),
('Fix iOS dark mode color inconsistencies', 'Some UI elements don''t properly adapt to dark mode. Status bar and navigation bar colors need adjustment.', true),
('Implement iOS share extension', 'Allow users to share content from other apps directly into new tickets. Should capture text, images, and URLs.', false),
('Fix iOS push notification delivery', 'Push notifications not appearing reliably on iOS devices. Works intermittently, need to investigate APNs configuration.', false);

-- Android Platform Tickets (7 tickets)
INSERT INTO tickets (title, description, is_completed) VALUES
('Fix Android back button navigation', 'Back button doesn''t properly navigate through app screens. Sometimes exits app when it should go back one screen.', false),
('Implement Android material design 3', 'Update app to use latest Material Design 3 components and theming. Make it feel more modern and consistent.', false),
('Fix Android memory leak in list view', 'Memory usage grows continuously when scrolling through long lists. Need to properly recycle view holders.', true),
('Add Android adaptive icons', 'Create adaptive icon that works well across different Android launchers and themes. Include monochrome version for themed icons.', true),
('Optimize Android APK size', 'APK is currently 45MB. Need to reduce to under 30MB by removing unused resources and enabling App Bundle.', false),
('Fix Android notification channels', 'Notification channels not properly configured. Users can''t customize notification preferences per category.', false),
('Implement Android in-app updates', 'Add support for seamless in-app update flow using Google Play Core library. Show update prompt when new version available.', false);

-- Web Platform Tickets (8 tickets)
INSERT INTO tickets (title, description, is_completed) VALUES
('Fix web app CORS issues in production', 'API calls failing with CORS errors when deployed to production. Works fine in development environment.', false),
('Implement web app offline support', 'Add service worker for offline functionality. Should cache critical assets and show offline indicator.', false),
('Optimize web bundle size', 'JavaScript bundle is 2.5MB. Need code splitting and lazy loading to reduce initial load to under 500KB.', false),
('Fix web responsive layout on tablets', 'Layout breaks on tablet screen sizes between 768-1024px. Need better breakpoints and flex layout.', true),
('Add web PWA install prompt', 'Implement install prompt for Progressive Web App. Should show banner on mobile browsers supporting PWA.', false),
('Fix web Safari flexbox rendering bug', 'Flexbox layout renders incorrectly on Safari only. Works fine on Chrome and Firefox. Need Safari-specific fix.', false),
('Implement web keyboard shortcuts', 'Add keyboard shortcuts for common actions: Cmd+K for search, Cmd+N for new ticket, Esc to close modals.', false),
('Fix web font loading flash', 'FOUT (Flash of Unstyled Text) occurs on page load. Need font-display strategy and preloading.', true);

-- Backend Tickets (7 tickets)
INSERT INTO tickets (title, description, is_completed) VALUES
('Optimize database query performance', 'Slow queries identified in production. Need to add indexes on ticket_tags and optimize JOIN queries. Target: <100ms.', false),
('Implement API rate limiting', 'Add rate limiting to prevent abuse. Should allow 100 requests per minute per IP, with higher limits for authenticated users.', false),
('Fix backend memory leak in websocket connections', 'Memory usage grows over time with active websocket connections. Need proper cleanup on disconnect.', true),
('Add backend caching layer with Redis', 'Implement Redis caching for frequently accessed data like tag lists and ticket counts. Should reduce database load by 60%.', false),
('Implement backend database migrations rollback', 'Need ability to safely rollback migrations in production. Current setup only supports forward migrations.', false),
('Fix backend API timeout on large datasets', 'API times out when fetching >1000 tickets. Need pagination and cursor-based loading.', false),
('Add backend audit logging', 'Implement audit trail for all CRUD operations. Should log user, timestamp, action, and changed fields.', false);

-- Auto Release / CI/CD Tickets (6 tickets)
INSERT INTO tickets (title, description, is_completed) VALUES
('Set up automated iOS release pipeline', 'Configure GitHub Actions to build, sign, and upload iOS app to TestFlight automatically on tag push.', false),
('Implement automated changelog generation', 'Auto-generate changelog from git commits using conventional commit format. Include in release notes.', true),
('Add automated E2E tests to CI pipeline', 'Run Playwright E2E tests on every PR. Should test critical user flows and block merge if tests fail.', false),
('Fix flaky CI tests', 'Unit tests occasionally fail in CI but pass locally. Need to identify and fix non-deterministic tests.', false),
('Set up automatic dependency updates', 'Configure Dependabot or Renovate to automatically create PRs for dependency updates weekly.', false),
('Implement automatic production deployment', 'Auto-deploy to production after successful CI run on main branch. Include smoke tests and rollback capability.', true);

-- Documentation Tickets (5 tickets)
INSERT INTO tickets (title, description, is_completed) VALUES
('Write API integration guide', 'Create comprehensive guide for integrating with our API. Include authentication, common patterns, and code examples.', false),
('Update user onboarding documentation', 'User docs are outdated with old screenshots. Need to update all screenshots and add video tutorials.', true),
('Create architecture decision records', 'Document major architectural decisions (ADRs) including context, options considered, and rationale.', false),
('Write database schema documentation', 'Document all database tables, columns, relationships, and indexes. Generate from schema comments.', false),
('Add inline code documentation', 'Many functions lack JSDoc/docstring comments. Add documentation for all public APIs and complex logic.', false);

-- Autocomplete Feature Tickets (4 tickets)
INSERT INTO tickets (title, description, is_completed) VALUES
('Implement autocomplete for ticket search', 'Add autocomplete dropdown showing matching tickets as user types. Should search title and description with debouncing.', false),
('Add autocomplete for tag selection', 'When adding tags to tickets, show autocomplete suggestions based on existing tags. Support keyboard navigation.', true),
('Optimize autocomplete query performance', 'Autocomplete queries are slow with large datasets. Add full-text search indexes and result caching.', false),
('Fix autocomplete keyboard navigation', 'Arrow keys don''t properly navigate autocomplete results. Need to handle up/down/enter/escape keys correctly.', false);

-- Bug Tickets (3 tickets)
INSERT INTO tickets (title, description, is_completed) VALUES
('Fix race condition in ticket update', 'When two users update same ticket simultaneously, changes from one user are lost. Need optimistic locking.', false),
('Fix XSS vulnerability in ticket description', 'User input in ticket descriptions not properly sanitized. Allows script injection. CRITICAL SECURITY ISSUE.', true),
('Fix timezone display issues', 'Timestamps showing in UTC instead of user''s local timezone. Need proper timezone conversion in UI.', false);

-- Enhancement Tickets (2 tickets)
INSERT INTO tickets (title, description, is_completed) VALUES
('Add bulk ticket operations', 'Allow users to select multiple tickets and perform bulk actions: complete, delete, add tags, change status.', false),
('Implement ticket attachments', 'Add ability to attach files to tickets. Support images, PDFs, and common document formats up to 10MB.', false);

-- ============================================================================
-- TICKET-TAG ASSOCIATIONS
-- ============================================================================

-- Get tag IDs (they will be 1-10 if starting fresh)
-- iOS tickets (1-8) with iOS tag (1), some with Bug (9) or Enhancement (10)
INSERT INTO ticket_tags (ticket_id, tag_id) VALUES
(1, 1), (1, 9),   -- iOS crash - iOS + Bug
(2, 1), (2, 10),  -- iOS biometric - iOS + Enhancement
(3, 1),           -- iOS performance - iOS
(4, 1), (4, 9),   -- iOS keyboard - iOS + Bug (completed)
(5, 1), (5, 10),  -- iOS widget - iOS + Enhancement
(6, 1), (6, 9),   -- iOS dark mode - iOS + Bug (completed)
(7, 1), (7, 10),  -- iOS share - iOS + Enhancement
(8, 1), (8, 9);   -- iOS notifications - iOS + Bug

-- Android tickets (9-15) with Android tag (2)
INSERT INTO ticket_tags (ticket_id, tag_id) VALUES
(9, 2), (9, 9),   -- Android back button - Android + Bug
(10, 2), (10, 10), -- Android Material Design - Android + Enhancement
(11, 2), (11, 9),  -- Android memory leak - Android + Bug (completed)
(12, 2), (12, 10), -- Android icons - Android + Enhancement (completed)
(13, 2),           -- Android APK size - Android
(14, 2), (14, 9),  -- Android notifications - Android + Bug
(15, 2), (15, 10); -- Android updates - Android + Enhancement

-- Web tickets (16-23) with Web tag (3)
INSERT INTO ticket_tags (ticket_id, tag_id) VALUES
(16, 3), (16, 9),  -- Web CORS - Web + Bug
(17, 3), (17, 10), -- Web offline - Web + Enhancement
(18, 3),           -- Web bundle - Web
(19, 3), (19, 9),  -- Web responsive - Web + Bug (completed)
(20, 3), (20, 10), -- Web PWA - Web + Enhancement
(21, 3), (21, 9),  -- Web Safari - Web + Bug
(22, 3), (22, 10), -- Web shortcuts - Web + Enhancement
(23, 3), (23, 9);  -- Web fonts - Web + Bug (completed)

-- Backend tickets (24-30) with Backend tag (4)
INSERT INTO ticket_tags (ticket_id, tag_id) VALUES
(24, 4),           -- Backend query performance
(25, 4), (25, 10), -- Backend rate limiting - Backend + Enhancement
(26, 4), (26, 9),  -- Backend memory leak - Backend + Bug (completed)
(27, 4), (27, 10), -- Backend Redis - Backend + Enhancement
(28, 4),           -- Backend migrations
(29, 4), (29, 9),  -- Backend timeout - Backend + Bug
(30, 4), (30, 10); -- Backend audit - Backend + Enhancement

-- Auto Release / CI/CD tickets (31-36) with Auto Release (5) and CI/CD (7)
INSERT INTO ticket_tags (ticket_id, tag_id) VALUES
(31, 5), (31, 7), (31, 1), -- iOS release - Auto Release + CI/CD + iOS
(32, 5), (32, 7),          -- Changelog - Auto Release + CI/CD (completed)
(33, 7),                   -- E2E tests - CI/CD
(34, 7), (34, 9),          -- Flaky tests - CI/CD + Bug
(35, 7),                   -- Dependency updates - CI/CD
(36, 5), (36, 7);          -- Auto deploy - Auto Release + CI/CD (completed)

-- Documentation tickets (37-41) with Documentation tag (6)
INSERT INTO ticket_tags (ticket_id, tag_id) VALUES
(37, 6),           -- API guide - Documentation
(38, 6),           -- User docs - Documentation (completed)
(39, 6),           -- ADRs - Documentation
(40, 6),           -- DB schema - Documentation
(41, 6);           -- Code docs - Documentation

-- Autocomplete tickets (42-45) with Autocomplete (8) tag
INSERT INTO ticket_tags (ticket_id, tag_id) VALUES
(42, 8), (42, 10), -- Search autocomplete - Autocomplete + Enhancement
(43, 8), (43, 10), -- Tag autocomplete - Autocomplete + Enhancement (completed)
(44, 8),           -- Autocomplete performance - Autocomplete
(45, 8), (45, 9);  -- Autocomplete keyboard - Autocomplete + Bug

-- Bug tickets (46-48) with Bug tag (9)
INSERT INTO ticket_tags (ticket_id, tag_id) VALUES
(46, 9), (46, 4),  -- Race condition - Bug + Backend
(47, 9), (47, 4),  -- XSS vulnerability - Bug + Backend (completed)
(48, 9), (48, 3);  -- Timezone - Bug + Web

-- Enhancement tickets (49-50) with Enhancement tag (10)
INSERT INTO ticket_tags (ticket_id, tag_id) VALUES
(49, 10),          -- Bulk operations - Enhancement
(50, 10), (50, 4); -- Attachments - Enhancement + Backend

-- ============================================================================
-- VERIFY DATA
-- ============================================================================

-- Show summary
SELECT 
    'Tags' as type, 
    COUNT(*) as count 
FROM tags
UNION ALL
SELECT 
    'Tickets' as type, 
    COUNT(*) as count 
FROM tickets
UNION ALL
SELECT 
    'Completed Tickets' as type, 
    COUNT(*) as count 
FROM tickets 
WHERE is_completed = true
UNION ALL
SELECT 
    'Tag Associations' as type, 
    COUNT(*) as count 
FROM ticket_tags;

-- Show tag distribution
SELECT 
    t.name as tag_name,
    COUNT(tt.ticket_id) as ticket_count
FROM tags t
LEFT JOIN ticket_tags tt ON t.id = tt.tag_id
GROUP BY t.id, t.name
ORDER BY ticket_count DESC, t.name;

-- Show completion stats by tag
SELECT 
    t.name as tag_name,
    COUNT(DISTINCT tk.id) as total_tickets,
    COUNT(DISTINCT CASE WHEN tk.is_completed THEN tk.id END) as completed_tickets,
    ROUND(
        100.0 * COUNT(DISTINCT CASE WHEN tk.is_completed THEN tk.id END) / 
        NULLIF(COUNT(DISTINCT tk.id), 0), 
        1
    ) as completion_rate
FROM tags t
LEFT JOIN ticket_tags tt ON t.id = tt.tag_id
LEFT JOIN tickets tk ON tt.ticket_id = tk.id
GROUP BY t.id, t.name
ORDER BY total_tickets DESC;

-- ============================================================================
-- NOTES
-- ============================================================================

-- This seed file creates a realistic project management scenario with:
-- 
-- Platform Coverage:
--   - 8 iOS tickets (mobile app development)
--   - 7 Android tickets (mobile app development)
--   - 8 Web tickets (web app development)
--   - 7 Backend tickets (API and database)
--
-- Project Management:
--   - 6 CI/CD and Auto Release tickets
--   - 5 Documentation tickets
--
-- Features:
--   - 4 Autocomplete feature tickets
--   - 3 Critical bug tickets
--   - 2 General enhancement tickets
--
-- Completion Status:
--   - 10 tickets marked as completed (~20% completion rate)
--   - 40 tickets still open (realistic backlog)
--
-- Tag Distribution:
--   - Multiple tickets have multiple tags (realistic categorization)
--   - Cross-cutting concerns (bugs, enhancements) span multiple platforms
--
-- Use Cases Demonstrated:
--   - Platform-specific development work
--   - DevOps and automation
--   - Documentation and knowledge management
--   - Feature development
--   - Bug tracking
--   - Technical debt management
--
-- To reset and reload:
--   TRUNCATE TABLE ticket_tags, tickets, tags RESTART IDENTITY CASCADE;
--   \i seed.sql
