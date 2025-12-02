# **Product Requirement Document (PRD)**

Project Name: appConsumer  
Project Brief: Tiktok-like Vertical Gallery Feed PWA (Project "Gallery-Lite")  
Version: 1.0  
Status: Final / Ready for Dev  
Date: December 02, 2025

## **1\. Executive Summary**

The objective is to build a high-performance **Free & Public** Progressive Web Application (PWA) that provides an immersive, full-screen vertical feed of **Image Galleries** (Slideshows). The app mimics the "Shorts" or "TikTok Photo Mode" experience but operates as a purely **client-side, anonymous experience**. There are no login screens, user accounts, authentication walls, or social profiles.

**Core Value Proposition:** A lightweight, frictionless visual storytelling experience that is immediately accessible to anyone with a web browser.

## **2\. Target Audience**

- **Public Mobile Users:** Casual viewers consuming visual content (photography, memes, product showcases) on iOS and Android.
- **Privacy-Conscious Users:** Users who prefer local data storage over cloud-synced accounts.

## **3\. User Stories & Interaction Flows**

This section details the user intent and the specific step-by-step flow for every interactive element.

### **3.1. Core Navigation & Playback (Slideshows)**

#### **Story 3.1.1: Feed Navigation**

- **User Story:** As a **User**, I want to swipe up to immediately snap to the next gallery card.
- **User Flow:**
  1. The user swipes finger upward.
  2. Viewport scrolls vertically.
  3. CSS Scroll Snap physics align the next Gallery Card.
  4. **System Response:** Previous card stops; new card starts autoplay timer (3s interval).
  5. **Edge Case:** If it's the last card, the scroll has resistance (no infinite loop at end of feed, only internal gallery loop).

#### **Story 3.1.2: Smart Reset**

- **User Story:** As a **User**, I want the gallery I just scrolled past to reset to the first image.
- **User Flow:**
  1. The user scrolls the active card out of view.
  2. IntersectionObserver detects visibility \< 50%.
  3. **System Response:** Card index resets to 0 instantly (no transition).

#### **Story 3.1.3: Toggle Slideshow**

- **User Story:** As a **User**, I want to tap to pause/resume the timer.
- **User Flow:**
  1. The user taps the center 60% of the screen.
  2. **Logic Check:** System waits **300ms** to ensure this isn't a Double Tap.
  3. **System Response:**
     - If Playing: Stop Timer. Show "Pause" icon fade.
     - If Paused: Start Timer. Show "Play" icon fade.

### **3.2. Primary Interactions (The "HUD")**

#### **Story 3.2.1: Local Like/Unlike**

- **User Story:** As a **User**, I want to double tap an image to "Like" it locally.
- **User Flow:**
  1. User taps twice within **300ms**.
  2. **System Response:**
     - **New Like:** Add ID to localStorage. Animate large center heart. Sidebar heart turns Red.
     - **Unlike:** Remove ID. Animate broken heart/fade. Sidebar heart turns Outline.

#### **Story 3.2.2: Comment Reader**

- **User Story:** As a **User**, I want to read public discussions.
- **User Flow:**
  1. User taps **Speech Bubble Icon**.
  2. **System Response:** Drawer slides up (50% height).
  3. **Empty State:** If no comments, display "No comments yet."
  4. **Close:** User taps backdrop or swipes drawer down.

#### **Story 3.2.3: Share Sheet**

- **User Story:** As a **User**, I want to open the native share menu.
- **User Flow:**
  1. User taps **Arrow Icon** (or uses Quick Share gesture).
  2. **System Response:** Trigger navigator.share().
  3. **Fallback:** If API unsupported (Desktop), copy URL to clipboard and show Toast "Link Copied".

### **3.3. Metadata & Discovery**

#### **Story 3.3.1: Pagination Tracking**

- **User Story:** As a **User**, I want to track slideshow progress.
- **User Flow:**
  1. Slideshow advances or the user taps the right edge to skip.
  2. **System Response:** Indicator (Dots or 1/5) updates instantly.

#### **Story 3.3.2: Context Info**

- **User Story:** As a **User**, I want to see the Artist and Caption.
- **User Flow:**
  1. User views Bottom-Left metadata layer.
  2. **System Response:** Text renders with text-shadow-md to ensure contrast against white/bright images.

### **3.4. Gestures (Power Actions)**

#### **Story 3.4.1: Local Quick Save/Unsave**

- **User Story:** As a **User**, I want to bookmark a gallery via gesture.
- **User Flow:**
  1. Long Press center (\>500ms). UI Dims. Icons appear: Save (Left), Share (Right).
  2. Drag Left.
  3. **System Response:**
     - **New Save:** Icon Green. On release: Add to Bookmarks.
     - **Already Saved:** Icon Red (Slash). On release: Remove Bookmark.
  4. Haptic feedback confirms action.

#### **Story 3.4.2: Quick Share Gesture**

- **User Story:** As a **User**, I want to share via gesture.
- **User Flow:**
  1. Long Press center.
  2. Drag Right.
  3. **System Response:** Share Icon turns Blue.
  4. On Release: Open Native Share Sheet.

### **3.5. Filtering**

- **User Story:** As a **User**, I want to filter the feed.
- **User Flow:**
  1. Tap Top-Left Filter Icon.
  2. Drawer slides in from Left. Background dims.
  3. User toggles "Swimwear" OFF.
  4. **System Response:** Update disabled_tags in storage.
  5. Close Drawer.
  6. **System Response:** Feed re-renders excluding "Swimwear" items.

## **4\. Functional Requirements**

### **4.1. The Feed**

- **FR-01:** CSS Scroll Snap y mandatory.
- **FR-02:** Infinite list logic (append items or loop data).
- **FR-03:** **Constraint:** Mobile Viewport Height must use 100dvh to account for dynamic address bars.

### **4.2. Gallery Playback**

- **FR-04:** Default autoplay interval: **3.0s**.
- **FR-05:** Only active card plays. Neighbors reset.
- **FR-06:** Tap (300ms debounce) toggles play/pause.
- **FR-07:** Images loop (Last \-\> First).

### **4.3. Filter Drawer**

- **FR-14:**
  - Trigger: Top-Left Icon.
  - Size: height: 100dvh, width: 71vw.
  - Backdrop: bg-black/50. Tapping the backdrop closes the drawer.
  - Logic: Switches \= ON (Show). OFF (Hide).
  - Storage: Persist state in localStorage key gallery_prefs_filters.

### **4.4. PWA & Persistence**

- **FR-12 (Service Worker):**
  - **Strategy:** next-pwa / serwist.
  - **Shell:** Cache-First.
  - **API:** Stale-While-Revalidate.
  - **Images:** Cache-First (LRU, max 100 items).
- **FR-13 (Storage):**
  - gallery_likes: Array of IDs.
  - gallery_bookmarks: Array of IDs.
  - gallery_prefs_filters: Object of disabled tags.

## **5\. Non-Functional Requirements & Error Handling**

### **5.1. Performance**

- **LCP:** \< 1.2s.
- **INP (Interaction to Next Paint):** \< 200ms (Crucial for gestures).
- **CLS:** 0 (Fixed dimensions).

### **5.2. Error States**

- **Image Fail:** If \<img\> fails to load, show a gray placeholder with a "Broken Image" icon. The slideshow timer should still proceed to the next image.
- **Empty Feed:** If filters exclude ALL items, show: "No results found. Adjust your filters."
- **Offline:** If network fails and image isn't cached, show offline-placeholder.svg.

## **6\. System Design & Atomic Components (ShadCN UI)**

### **6.1. Core Components**

- **Carousel:** (Embla Carousel or similar).
- **Sheet:** (Vaul Drawer or Radix Dialog) for Comments and Filters.
- **Switch:** (Radix Switch) for Filters.
- **Toast:** (Sonner/Radix Toast) for "Link Copied" feedback.

### **6.2. Gesture Logic**

| Gesture        | Timing/Threshold  | Action               | Priority                  |
| :------------- | :---------------- | :------------------- | :------------------------ |
| **Tap**        | \< 300ms          | Toggle Pause         | Low (Wait for double tap) |
| **Double Tap** | 2 taps w/in 300ms | Like                 | High                      |
| **Long Press** | \> 500ms hold     | Open Gesture Overlay | High                      |
| **Drag**       | \> 50px movement  | Trigger Save/Share   | High                      |

## **7\. Layout Specifications**

**Grid System:** 3x3 Overlay. **Dimensions:** width: 100%, height: 100dvh.

| Grid Area           | UI Element       | Position CSS                                 |
| :------------------ | :--------------- | :------------------------------------------- |
| **Row 1 / Col 1**   | **Filter Icon**  | top-4, left-4, absolute, z-50                |
| **Row 2 / Col 1-3** | **Gesture Zone** | inset-0, absolute, z-10                      |
| **Row 3 / Col 2**   | **Pagination**   | bottom-\[100px\], left-4, absolute           |
| **Row 3 / Col 2**   | **Metadata**     | bottom-6, left-4, absolute, max-w-\[75%\]    |
| **Row 3 / Col 3**   | **Action Bar**   | bottom-6, right-4, absolute, flex-col, gap-4 |

## **8\. Taxonomy Reference (Filter Lists)**

_See Section 14 for Data implementation._

**Sections:**

1. **Gender:** Female, Male, Non-Binary, Androgynous, Transgender, Couple (M/F), Couple (Same-Sex), Group.
2. **Type:** Tops, Bottoms, Full Body, Outerwear, Specialty.
3. **Style:** Core, Street, Alternative, Vintage, Niche, Regional, Vibe.

## **10\. Technical Stack**

- **Framework:** Next.js 14+ (App Router).
- **PWA:** @ducanh2912/next-pwa or serwist.
- **UI:** Tailwind CSS \+ ShadCN UI (Radix Primitives).
- **Gestures:** use-gesture (React UseGesture) for reliable drag/hold logic.
- **Icons:** Lucide React.

## **11\. Accessibility (A11y)**

- **Screen Readers:**
  - Gallery Image must have alt text populated from the caption.
  - Filter Toggle Switches must have aria-label="Toggle \[Category Name\]".
- **Focus Management:** When the Filter/Comment drawer opens, focus is trapped within the drawer.
- **Contrast:** Metadata text requires text-shadow or a subtle bg-gradient-to-t from-black/50 overlay at the bottom 30% of the screen.

## **14\. Data Schema & API Contract**

### **14.1. Mock Data (JSON)**

{  
 "feed": \[  
 {  
 "id": "gallery-001",  
 "artist_name": "Elena V.",  
 "caption": "Summer vibes \#vintage",  
 "images": \["/mock/img1.webp", "/mock/img2.webp"\],  
 "taxonomy": {  
 "gender": "Female",  
 "type": "Dress (Casual)",  
 "style": \["Vintage", "Chic"\]  
 },  
 "stats": { "likes_count": 120, "comments_count": 5 },  
 "comments": \[  
 { "user": "Anon1", "text": "Great shot\!" }  
 \]  
 }  
 \]  
}

### **14.2. TypeScript Interface**

export interface Taxonomy {  
 gender: string; // See Taxonomy Reference  
 type: string;  
 style: string\[\];  
}

export interface GalleryItem {  
 id: string;  
 artist_name: string;  
 caption: string;  
 images: string\[\];  
 taxonomy: Taxonomy;  
 stats: {  
 likes_count: number;  
 comments_count: number;  
 };  
 comments: { user: string; text: string }\[\];  
}

### **14.3. Data Flow (Filtering)**

- **Frontend Logic:**
  - Fetch full feed (or paginated).
  - Read localStorage.getItem('gallery_prefs_filters').
  - Filter Array: feed.filter(item \=\> \!disabledTags.includes(item.taxonomy.type) && ...)
  - **Note:** Filtering happens Client-Side for the "Anonymous/Offline" MVP. API filtering (Section 14.3 in v2.9) is optional for V1 but good for V2.
