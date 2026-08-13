# Workflow Interface Styles - Implementation Guide

This guide explains how to use the CSS styles created from the Figma design specifications for the workflow interface.

## 📁 File Structure

- **WorkflowStyles.css** - Complete CSS stylesheet with all design specifications
- **CompleteWorkflow.jsx** - Main React component for the workflow interface

## 🎨 Design Tokens

### Colors
```css
Primary Teal:     #00BCD4
Background:       #F8FAFC
White:            #FFFFFF
Border:           #E2E8F0
Text Dark:        #1E293B
Text Muted:       #94A3B8
User Message BG:  #F0FDF9
Sidebar BG:       #F5F8FA
```

### Typography
```css
Primary Font: 'Geist', sans-serif
Stepper Font: 'Inter', sans-serif
```

## 🏗️ Component Structure

### 1. Main Workspace Container
```html
<div class="main-workspace">
  <!-- Top Navigation -->
  <!-- App Toolbar -->
  <!-- Content with Stepper -->
</div>
```

**CSS Class:** `.main-workspace`
- Width: 1240px
- Height: 1024px
- Background: #F8FAFC

---

### 2. Top Navigation Bar

```html
<div class="top-nav">
  <div class="session-breadcrumb">
    <span class="breadcrumb-item">New Project</span>
    <span class="breadcrumb-separator">/</span>
    <span class="breadcrumb-item">Type 2 Diabetes</span>
    <span class="breadcrumb-separator">/</span>
    <span class="breadcrumb-item active">JAK2 Query</span>
  </div>
</div>
```

**CSS Classes:**
- `.top-nav` - Navigation container
- `.session-breadcrumb` - Breadcrumb wrapper
- `.breadcrumb-item` - Individual breadcrumb
- `.breadcrumb-item.active` - Active breadcrumb (bold)
- `.breadcrumb-separator` - "/" separator

---

### 3. App Toolbar

```html
<div class="app-toolbar">
  <div class="tabs-row">
    <div class="tabs-left">
      <!-- Pill Tabs -->
      <!-- Query Tab -->
    </div>
    <div class="branch-group">
      <!-- Branch Selector -->
      <!-- Share Button -->
    </div>
  </div>
</div>
```

**CSS Classes:**
- `.app-toolbar` - Toolbar container (height: 92px)
- `.tabs-row` - Row containing tabs (height: 44px)
- `.tabs-left` - Left section with tabs

---

### 4. Pill Tabs

```html
<div class="pill-tabs">
  <!-- Chat Tab (Active) -->
  <div class="tab-chat">
    <div class="chat-pill">
      <svg class="icon"><!-- message icon --></svg>
      <span class="label">Chat</span>
    </div>
  </div>
  
  <!-- Artifacts Tab -->
  <div class="tab-artifacts">
    <svg class="icon"><!-- file icon --></svg>
    <span class="label">Artifacts</span>
    <div class="artifact-badge">
      <span class="count">1</span>
    </div>
  </div>
  
  <!-- Lineage Tab -->
  <div class="tab-lineage">
    <span class="label">Lineage</span>
  </div>
</div>
```

**CSS Classes:**
- `.pill-tabs` - Container with rounded background (#F0F2F5)
- `.tab-chat` - Chat tab wrapper
- `.chat-pill` - Active chat pill (dark background #1E293B)
- `.tab-artifacts` - Artifacts tab
- `.artifact-badge` - Badge showing count
- `.tab-lineage` - Lineage tab

---

### 5. Query Tab

```html
<div class="tab-drug">
  <div class="num-badge">
    <span class="number">1</span>
  </div>
  <span class="title">Target identification query</span>
  <span class="count">/ 1</span>
  <div class="status-badges">
    <div class="accepted-badge">
      <span class="status-dot"></span>
      <span class="status-text">Searching databases</span>
    </div>
  </div>
</div>
```

**CSS Classes:**
- `.tab-drug` - Query tab container
- `.num-badge` - Circular badge with number (teal background)
- `.title` - Query title (semi-bold)
- `.status-badges` - Status indicators container
- `.status-dot` - Colored status dot

---

### 6. Vertical Stepper

```html
<div class="vertical-stepper">
  <!-- Active Step -->
  <div class="step-3-active-row">
    <div class="active-border"></div>
    <div class="dash-container-3">
      <div class="dash-3"></div>
    </div>
    <div class="active-content">
      <div class="badge-active">
        <span class="badge-text">01</span>
      </div>
      <span class="text-3">TxKG</span>
    </div>
  </div>
  
  <!-- Connector -->
  <div class="connector-1">
    <span class="connector-dot"></span>
    <span class="connector-dot"></span>
    <span class="connector-dot"></span>
  </div>
  
  <!-- Inactive Step -->
  <div class="step-4-row">
    <span class="text-4">02 LitMineX</span>
  </div>
</div>
```

**CSS Classes:**
- `.vertical-stepper` - Stepper container (width: 180px, background: #F5F8FA)
- `.step-3-active-row` - Active step row (height: 42px)
- `.active-border` - Left border indicator (3px, teal)
- `.dash-3` - Horizontal dash (20px, teal)
- `.badge-active` - Step number badge (teal pill)
- `.connector-1/2/3/4` - Dotted connectors between steps
- `.connector-dot` - Individual connector dot (3px)

---

### 7. Chat Messages

```html
<div class="messages-list">
  <!-- User Message -->
  <div class="user-message-row">
    <div class="message-bubble">
      <div class="bubble-header">
        <span class="user-name">DR. PRIYA (YOU)</span>
      </div>
      <p class="message-text">Find protein targets associated with Type 2 Diabetes for drug repurposing</p>
    </div>
  </div>
  
  <!-- Agent Thinking -->
  <div class="agent-thinking-row">
    <div class="thinking-bubble">
      <div class="bubble-header">
        <div class="agent-avatar">
          <svg class="icon"><!-- sparkles icon --></svg>
        </div>
        <span class="agent-name">INOVAPATH TXKG AGENT</span>
      </div>
      <div class="status-processing">
        <div class="spinner-container">
          <span class="spinner-dot"></span>
          <span class="spinner-dot"></span>
          <span class="spinner-dot"></span>
        </div>
        <span class="status-message">Searching biomedical databases (NCBI, UniProt, TxKG relations)...</span>
      </div>
    </div>
  </div>
</div>
```

**CSS Classes:**
- `.messages-list` - Messages container
- `.user-message-row` - User message wrapper (justified to right)
- `.message-bubble` - Message bubble (background: #F0FDF9)
- `.bubble-header` - Message header with user name
- `.agent-thinking-row` - Agent message wrapper
- `.thinking-bubble` - Agent message bubble (white background)
- `.agent-avatar` - Agent icon container (teal border)
- `.status-processing` - Processing status row
- `.spinner-container` - Animated loading dots
- `.spinner-dot` - Individual loading dot (animated)

---

### 8. Chat Input Bar

```html
<div class="chat-input-bar-container">
  <div class="input-row">
    <input type="text" class="chat-placeholder" placeholder="Type @ for modules or ask a research question..." />
  </div>
  <div class="toolbar">
    <div class="toolbar-left">
      <button class="btn-focus">
        <svg class="icon"><!-- plus icon --></svg>
      </button>
    </div>
    <div class="toolbar-right">
      <div class="mic-icon-container">
        <svg class="mic-icon"><!-- mic icon --></svg>
      </div>
      <button class="btn-pause">
        <div class="stop-square"></div>
      </button>
    </div>
  </div>
</div>
```

**CSS Classes:**
- `.chat-input-bar-container` - Input bar wrapper (white background, shadow)
- `.input-row` - Input field row
- `.chat-placeholder` - Input field
- `.toolbar` - Bottom toolbar with controls
- `.toolbar-left` - Left toolbar section
- `.btn-focus` - Focus button (+ icon)
- `.toolbar-right` - Right toolbar section
- `.btn-pause` - Pause/stop button (dark circular)

---

## 🔧 Usage with React/Material-UI

### Option 1: Import CSS File

```jsx
import './WorkflowStyles.css';

function CompleteWorkflow() {
  return (
    <div className="main-workspace">
      <div className="top-nav">
        {/* ... */}
      </div>
    </div>
  );
}
```

### Option 2: Convert to Material-UI sx Props

The existing component uses Material-UI's `sx` prop. You can convert CSS classes to sx objects:

```jsx
<Box sx={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  width: '1240px',
  height: '1024px',
  background: '#F8FAFC'
}}>
  {/* Content */}
</Box>
```

### Option 3: Hybrid Approach (Recommended)

Use CSS for layout and structure, sx for dynamic styling:

```jsx
<div className="main-workspace">
  <Box sx={{ opacity: loading ? 0.5 : 1 }}>
    {/* Dynamic content */}
  </Box>
</div>
```

---

## 📐 Layout Dimensions

| Component | Width | Height | Padding |
|-----------|-------|--------|---------|
| Main Workspace | 1240px | 1024px | 0px |
| Top Nav | 1240px | 49px | 16px 32px |
| App Toolbar | 1240px | 92px | 24px 0px 0px |
| Tabs Row | 1240px | 44px | 0px 32px |
| Vertical Stepper | 180px | 883px | 30px 0px 0px |
| Main Content | 1060px | 883px | 0px |
| Chat Container | 1060px | 969px | 24px 40px 40px |
| Messages List | 980px | Auto | 0px |
| Input Bar | 980px | 94px | 16px |

---

## 🎯 Key Design Patterns

### 1. Auto Layout (Flexbox)
All containers use CSS Flexbox with explicit dimensions from Figma.

### 2. Fixed Dimensions
Most elements have fixed widths and heights to match the design exactly.

### 3. Border Radius
- Pill tabs: 22px outer, 20px inner
- Badges: 11px (stepper), 9px-10px (counts)
- Cards/Bubbles: 12px
- Buttons: 6-8px

### 4. Spacing
- Gap between tabs: 16px
- Gap in messages: 16px
- Padding in bubbles: 16-20px
- Connector dots gap: 4px

### 5. Typography Hierarchy
- Headers: 11px uppercase, bold, letter-spacing 0.5px
- Body: 13-14px regular/medium
- Stepper active: 15px bold
- Stepper inactive: 14px medium

---

## 🚀 Quick Start

1. **Import the CSS file** in your component:
   ```jsx
   import './WorkflowStyles.css';
   ```

2. **Replace inline styles** with CSS classes:
   ```jsx
   // Before
   <Box sx={{ width: '1240px', background: '#F8FAFC' }}>
   
   // After
   <div className="main-workspace">
   ```

3. **Keep Material-UI** for interactive elements:
   ```jsx
   <Button variant="outlined" className="share-btn">
     Share
   </Button>
   ```

---

## 📝 Notes

- All dimensions are from Figma's Auto Layout specifications
- Colors match Figma's fill values exactly
- Font families: 'Geist' for UI, 'Inter' for stepper
- Animations included for spinner dots (pulse effect)
- Responsive adjustments included for screens < 1240px

---

## 🐛 Common Issues

1. **Font not loading**: Ensure 'Geist' and 'Inter' fonts are imported in your project
2. **Layout overflow**: Check parent container constraints
3. **Icons not showing**: SVG paths may need adjustment based on your icon library
4. **Z-index conflicts**: Branch dropdown has z-index: 1400

---

## 📚 Additional Resources

- Figma Design: [Original specifications provided]
- Material-UI Docs: https://mui.com/
- CSS Flexbox Guide: https://css-tricks.com/snippets/css/a-guide-to-flexbox/

---

**Last Updated:** 2026-08-12
**Version:** 1.0.0
