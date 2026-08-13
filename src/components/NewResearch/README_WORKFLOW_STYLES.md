# 🎨 Workflow Interface Styles - Complete Package

This package contains all CSS styles and documentation for implementing the Figma design specifications for the DRP-UI workflow interface.

## 📦 Package Contents

### 1. **WorkflowStyles.css** ⭐
**Main CSS stylesheet with all Figma design specifications**

Contains CSS classes for:
- Main workspace layout (1240×1024px)
- Top navigation bar with breadcrumbs
- App toolbar with pill tabs
- Vertical stepper (180px sidebar)
- Chat interface with messages
- Agent thinking bubbles with animated spinners
- Input bar with toolbar
- Branch selector and share button
- All colors, typography, and spacing from Figma

**Usage:**
```jsx
import './WorkflowStyles.css';

<div className="main-workspace">
  <div className="top-nav">
    {/* Your content */}
  </div>
</div>
```

---

### 2. **WORKFLOW_STYLES_GUIDE.md** 📖
**Comprehensive documentation and usage guide**

Includes:
- Complete component structure breakdown
- HTML examples for each UI section
- CSS class reference
- Layout dimensions table
- Design patterns and best practices
- Integration options (pure CSS, Material-UI, hybrid)
- Troubleshooting tips

**Start here if:** You want to understand the overall design structure

---

### 3. **WorkflowStylesIntegration.jsx** 🔧
**React component examples with CSS integration**

Provides ready-to-use components:
- `TopNavBar` - Navigation with breadcrumbs
- `PillTabs` - Tab selector with active states
- `VerticalStepper` - Left sidebar stepper
- `UserMessage` - User chat bubble
- `AgentThinking` - AI agent processing bubble
- `ChatInputBar` - Message input with toolbar
- `BranchSelector` - Branch dropdown
- `WorkflowLayoutExample` - Complete layout demo

**Usage:**
```jsx
import { UserMessage, AgentThinking } from './WorkflowStylesIntegration';

<UserMessage message="Your query here" />
<AgentThinking status="Processing..." />
```

---

### 4. **MIGRATION_GUIDE.md** 🚀
**Step-by-step guide to convert Material-UI inline styles to CSS**

Shows:
- Before/After comparisons
- 8 detailed examples
- Migration checklist
- Common patterns
- Testing guidelines
- Pro tips for smooth migration

**Start here if:** You're converting existing Material-UI code

---

## 🎯 Quick Start

### For New Components:

1. Import the CSS:
   ```jsx
   import './WorkflowStyles.css';
   ```

2. Use CSS classes directly:
   ```jsx
   <div className="main-workspace">
     <div className="top-nav">
       <div className="session-breadcrumb">
         <span className="breadcrumb-item active">JAK2 Query</span>
       </div>
     </div>
   </div>
   ```

3. Reference the guide for class names and structure

---

### For Existing Material-UI Components:

1. Read **MIGRATION_GUIDE.md**
2. Start with one section (e.g., navigation bar)
3. Replace `<Box sx={...}>` with `<div className="...">`
4. Test incrementally
5. Move to next section

---

## 🎨 Design Specifications

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary Teal | `#00BCD4` | Active states, badges, borders |
| Background | `#F8FAFC` | Main workspace background |
| White | `#FFFFFF` | Cards, messages, toolbar |
| Border | `#E2E8F0` | All borders and dividers |
| Text Dark | `#1E293B` | Primary text |
| Text Muted | `#94A3B8` | Secondary text |
| User Message | `#F0FDF9` | User chat bubble background |
| Sidebar | `#F5F8FA` | Stepper background |

### Typography
| Font | Weight | Size | Usage |
|------|--------|------|-------|
| Geist | 700 | 11px | Headers (uppercase) |
| Geist | 600 | 13px | Active tabs, titles |
| Geist | 400-500 | 13-14px | Body text |
| Inter | 700 | 15px | Active stepper label |
| Inter | 500 | 14px | Inactive stepper label |

### Spacing
| Element | Dimensions |
|---------|-----------|
| Main Workspace | 1240×1024px |
| Top Nav | 1240×49px, padding: 16px 32px |
| App Toolbar | 1240×92px, padding: 24px 0 0 |
| Vertical Stepper | 180×883px, padding-top: 30px |
| Main Content | 1060×883px |
| Chat Container | 1060×969px, padding: 24px 40px 40px |
| Input Bar | 980×94px, padding: 16px |

### Border Radius
- Pill tabs outer: 22px
- Pill tabs inner: 20px
- Cards/Bubbles: 12px
- Badges: 9-11px
- Buttons: 6-8px

---

## 📁 File Locations

All files are located in:
```
src/components/NewResearch/
├── WorkflowStyles.css                    ← Main stylesheet
├── WORKFLOW_STYLES_GUIDE.md             ← Documentation
├── WorkflowStylesIntegration.jsx        ← React examples
├── MIGRATION_GUIDE.md                   ← Migration guide
└── README_WORKFLOW_STYLES.md            ← This file
```

---

## 🔍 Component Reference

### Layout Components
- `.main-workspace` - Root container
- `.content-with-stepper` - Stepper + content wrapper
- `.main-content-area` - Right content panel

### Navigation Components  
- `.top-nav` - Top navigation bar
- `.session-breadcrumb` - Breadcrumb container
- `.breadcrumb-item` - Breadcrumb text
- `.app-toolbar` - Toolbar below nav

### Tab Components
- `.pill-tabs` - Tab group container
- `.tab-chat` - Chat tab
- `.chat-pill` - Active chat pill (dark)
- `.tab-artifacts` - Artifacts tab
- `.tab-lineage` - Lineage tab
- `.tab-drug` - Query/result tab

### Stepper Components
- `.vertical-stepper` - Left sidebar stepper
- `.step-3-active-row` - Active step
- `.badge-active` - Active step badge
- `.text-3` - Active step text
- `.connector-1/2/3/4` - Dot connectors

### Message Components
- `.messages-list` - Messages container
- `.user-message-row` - User message wrapper
- `.message-bubble` - Message bubble
- `.agent-thinking-row` - Agent message wrapper
- `.thinking-bubble` - Agent bubble
- `.agent-avatar` - Agent icon

### Input Components
- `.chat-input-bar-container` - Input container
- `.input-row` - Input field row
- `.toolbar` - Bottom toolbar
- `.btn-focus` - Plus button
- `.btn-pause` - Submit/pause button

### UI Elements
- `.num-badge` - Circular number badge
- `.artifact-badge` - Small count badge
- `.status-badges` - Status indicators
- `.branch-selector` - Branch dropdown
- `.share-btn` - Share button
- `.spinner-container` - Loading spinner

---

## 🚀 Implementation Strategies

### Strategy 1: Pure CSS (Recommended for Static Layouts)
**Best for:** Navigation, stepper, layout containers

```jsx
import './WorkflowStyles.css';

<div className="vertical-stepper">
  <div className="step-3-active-row">
    {/* ... */}
  </div>
</div>
```

**Pros:**
- Cleanest code
- Best performance
- Easier to maintain
- Matches Figma exactly

**Cons:**
- Less flexibility for dynamic styles

---

### Strategy 2: Material-UI (Keep for Interactive Elements)
**Best for:** Buttons, menus, modals, forms

```jsx
<Button 
  variant="outlined" 
  className="share-btn"
  onClick={handleShare}
>
  Share
</Button>
```

**Pros:**
- Built-in accessibility
- Rich interactions
- Consistent with existing code

**Cons:**
- Heavier bundle size

---

### Strategy 3: Hybrid (Recommended Overall)
**Best for:** Complete components

```jsx
<div className="message-bubble">
  <Box sx={{ 
    opacity: isLoading ? 0.5 : 1,
    transition: 'opacity 0.3s'
  }}>
    <span className="message-text">{message}</span>
  </Box>
</div>
```

**Pros:**
- Best of both worlds
- Static layout via CSS
- Dynamic behavior via sx

**Cons:**
- Need to decide on boundaries

---

## ✅ Quality Checklist

Before considering implementation complete:

### Visual
- [ ] All dimensions match Figma (use browser DevTools)
- [ ] All colors match exactly (#00BCD4, #F8FAFC, etc.)
- [ ] Fonts loaded and applied (Geist, Inter)
- [ ] Border radius correct (22px, 12px, 11px, etc.)
- [ ] Spacing matches (gaps, padding, margins)

### Functional
- [ ] Tabs switch correctly
- [ ] Stepper shows active/completed/inactive states
- [ ] Messages display properly
- [ ] Input bar accepts text
- [ ] Buttons are clickable
- [ ] Dropdowns open/close

### Responsive
- [ ] Layout works at 1240px width
- [ ] Elements don't overflow
- [ ] Text doesn't wrap unexpectedly
- [ ] Scroll works where needed

### Performance
- [ ] No layout shift on load
- [ ] Animations smooth (60fps)
- [ ] CSS file size reasonable (<50KB)
- [ ] No unused classes in production

---

## 🐛 Troubleshooting

### Issue: Styles not applying

**Solution:**
1. Check CSS import order (should be early in component)
2. Check for typos in class names
3. Ensure CSS file is in correct location
4. Check browser DevTools to see which styles are applied

### Issue: Font not displaying

**Solution:**
1. Add font imports to your main CSS or index.html:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
   ```
2. Check font family spelling in CSS ('Geist', 'Inter')
3. Ensure fallback fonts are available

### Issue: Layout breaking

**Solution:**
1. Check container widths (main-workspace: 1240px)
2. Verify flexbox properties
3. Check for conflicting Material-UI styles
4. Use browser DevTools to inspect computed styles

### Issue: Animations not working

**Solution:**
1. Check @keyframes definition in CSS
2. Verify animation property on elements
3. Test in different browsers
4. Check for CSS conflicts

---

## 📚 Additional Resources

### Internal Files
- [Complete Style Guide](./WORKFLOW_STYLES_GUIDE.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [React Integration Examples](./WorkflowStylesIntegration.jsx)

### External Resources
- [CSS Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Material-UI Documentation](https://mui.com/)
- [Figma Design Specifications](https://www.figma.com/)

---

## 🔄 Version History

### v1.0.0 (2026-08-12)
- Initial release
- Complete CSS from Figma specifications
- All documentation
- React integration examples
- Migration guide

---

## 💬 Support

If you encounter issues or have questions:

1. Check **WORKFLOW_STYLES_GUIDE.md** for component documentation
2. Review **MIGRATION_GUIDE.md** for conversion help
3. Inspect **WorkflowStylesIntegration.jsx** for working examples
4. Use browser DevTools to debug styles
5. Compare with original Figma design

---

## 🎉 You're Ready!

You now have everything needed to implement the workflow interface design:

1. ✅ Complete CSS stylesheet
2. ✅ Comprehensive documentation
3. ✅ React component examples
4. ✅ Migration guide
5. ✅ This README for navigation

**Start with** WORKFLOW_STYLES_GUIDE.md to understand the structure, then use MIGRATION_GUIDE.md to convert your existing code!

---

**Last Updated:** 2026-08-12  
**Author:** GitHub Copilot  
**Version:** 1.0.0
