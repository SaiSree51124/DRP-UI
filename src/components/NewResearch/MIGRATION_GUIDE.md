# Migration Guide: Material-UI Inline Styles → CSS Classes

This guide shows how to convert existing Material-UI `sx` props to CSS classes from WorkflowStyles.css.

## 🔄 Quick Reference: Before & After

### Example 1: Main Workspace Container

**❌ BEFORE (Material-UI sx prop):**
```jsx
<Box sx={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  width: '1240px',
  height: '1024px',
  background: '#F8FAFC',
  flex: 'none',
  order: 1,
  alignSelf: 'stretch',
  flexGrow: 0
}}>
  {/* content */}
</Box>
```

**✅ AFTER (CSS class):**
```jsx
<div className="main-workspace">
  {/* content */}
</div>
```

---

### Example 2: Top Navigation Bar

**❌ BEFORE:**
```jsx
<Box sx={{
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 32px',
  width: '1240px',
  height: '49px',
  background: '#FFFFFF',
  borderBottom: '1px solid #E2E8F0',
  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 0
}}>
  {/* breadcrumbs */}
</Box>
```

**✅ AFTER:**
```jsx
<div className="top-nav">
  {/* breadcrumbs */}
</div>
```

---

### Example 3: Breadcrumb Items

**❌ BEFORE:**
```jsx
<Typography sx={{
  fontFamily: "'Geist',sans-serif",
  fontSize: '13px',
  fontWeight: 400,
  lineHeight: '17px',
  color: '#94A3B8'
}}>
  New Project
</Typography>

<Typography sx={{
  fontFamily: "'Geist',sans-serif",
  fontSize: '13px',
  fontWeight: 600,
  lineHeight: '17px',
  color: '#1E293B'
}}>
  JAK2 Query
</Typography>
```

**✅ AFTER:**
```jsx
<span className="breadcrumb-item">New Project</span>
<span className="breadcrumb-item active">JAK2 Query</span>
```

---

### Example 4: Chat Pill (Active Tab)

**❌ BEFORE:**
```jsx
<Box sx={{
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '5px 12px',
  gap: '6px',
  width: '72px',
  height: '27px',
  background: '#1E293B',
  borderRadius: '20px',
  flex: 'none',
  order: 0,
  flexGrow: 0
}}>
  <MessageSquareIcon sx={{ width: 12, height: 12 }} />
  <Typography sx={{
    fontFamily: "'Geist',sans-serif",
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: '17px',
    color: '#FFFFFF'
  }}>
    Chat
  </Typography>
</Box>
```

**✅ AFTER:**
```jsx
<div className="chat-pill">
  <MessageSquareIcon className="icon" />
  <span className="label">Chat</span>
</div>
```

---

### Example 5: Vertical Stepper Active Step

**❌ BEFORE:**
```jsx
<Box sx={{
  display: 'flex',
  alignItems: 'center',
  height: '42px',
  width: '180px'
}}>
  <Box sx={{
    width: '20px',
    height: 0,
    borderTop: '1.5px solid #00BCD4'
  }} />
  <Box sx={{
    borderRadius: '11px',
    px: '8px',
    py: '3px',
    bgcolor: '#00BCD4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <Typography sx={{
      fontFamily: "'Inter',sans-serif",
      fontSize: '11px',
      fontWeight: 700,
      color: '#FFFFFF',
      lineHeight: 1
    }}>
      01
    </Typography>
  </Box>
  <Typography sx={{
    fontFamily: "'Inter',sans-serif",
    fontSize: '15px',
    fontWeight: 700,
    color: '#00BCD4',
    ml: '10px',
    lineHeight: 1
  }}>
    TxKG
  </Typography>
</Box>
```

**✅ AFTER:**
```jsx
<div className="step-3-active-row">
  <div className="dash-3"></div>
  <div className="active-content">
    <div className="badge-active">
      <span className="badge-text">01</span>
    </div>
    <span className="text-3">TxKG</span>
  </div>
</div>
```

---

### Example 6: User Message Bubble

**❌ BEFORE:**
```jsx
<Box sx={{
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '8px 0'
}}>
  <Box sx={{
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '16px',
    gap: '8px',
    width: '503px',
    background: '#F0FDF9',
    border: '1px solid rgba(226, 232, 240, 0.3)',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.03)',
    borderRadius: '12px'
  }}>
    <Typography sx={{
      fontFamily: "'Geist',sans-serif",
      fontSize: '11px',
      fontWeight: 700,
      color: '#00BCD4',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      DR. PRIYA (YOU)
    </Typography>
    <Typography sx={{
      fontFamily: "'Geist',sans-serif",
      fontSize: '14px',
      fontWeight: 400,
      color: '#1E293B',
      lineHeight: '22px'
    }}>
      Find protein targets associated with Type 2 Diabetes
    </Typography>
  </Box>
</Box>
```

**✅ AFTER:**
```jsx
<div className="user-message-row">
  <div className="message-bubble">
    <div className="bubble-header">
      <span className="user-name">DR. PRIYA (YOU)</span>
    </div>
    <p className="message-text">
      Find protein targets associated with Type 2 Diabetes
    </p>
  </div>
</div>
```

---

### Example 7: Agent Thinking with Spinner

**❌ BEFORE:**
```jsx
<Box sx={{
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
}}>
  <Box sx={{ display: 'flex', gap: '6px' }}>
    <Box sx={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      bgcolor: '#00BCD4',
      animation: 'pulse 1.4s ease-in-out infinite'
    }} />
    <Box sx={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      bgcolor: '#00BCD4',
      animation: 'pulse 1.4s ease-in-out 0.2s infinite'
    }} />
    <Box sx={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      bgcolor: '#00BCD4',
      animation: 'pulse 1.4s ease-in-out 0.4s infinite'
    }} />
  </Box>
  <Typography sx={{
    fontFamily: "'Geist',sans-serif",
    fontSize: '13px',
    color: '#475569'
  }}>
    Searching databases...
  </Typography>
</Box>
```

**✅ AFTER:**
```jsx
<div className="status-processing">
  <div className="spinner-container">
    <span className="spinner-dot"></span>
    <span className="spinner-dot"></span>
    <span className="spinner-dot"></span>
  </div>
  <span className="status-message">Searching databases...</span>
</div>
```

---

### Example 8: Chat Input Bar

**❌ BEFORE:**
```jsx
<Box sx={{
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '16px',
  gap: '12px',
  width: '980px',
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
  borderRadius: '12px'
}}>
  <TextField
    fullWidth
    placeholder="Type @ for modules or ask a research question..."
    sx={{
      fontFamily: "'Geist',sans-serif",
      fontSize: '14px',
      color: '#94A3B8'
    }}
  />
  <Box sx={{
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  }}>
    {/* toolbar buttons */}
  </Box>
</Box>
```

**✅ AFTER:**
```jsx
<div className="chat-input-bar-container">
  <div className="input-row">
    <input 
      type="text"
      className="chat-placeholder"
      placeholder="Type @ for modules or ask a research question..."
    />
  </div>
  <div className="toolbar">
    {/* toolbar buttons */}
  </div>
</div>
```

---

## 🛠️ Step-by-Step Migration Process

### Step 1: Identify Component Sections

Look at your component and identify major sections:
- Navigation bar
- Toolbar
- Stepper
- Content area
- Messages
- Input bar

### Step 2: Replace Container `<Box>` with `<div>`

```jsx
// BEFORE
<Box sx={{ /* many styles */ }}>

// AFTER
<div className="appropriate-class-name">
```

### Step 3: Replace Typography with Semantic HTML

```jsx
// BEFORE
<Typography sx={{ fontFamily: "'Geist'", fontSize: '13px', ... }}>

// AFTER (for regular text)
<span className="breadcrumb-item">

// AFTER (for headings)
<h3 className="agent-name">
```

### Step 4: Keep Material-UI for Interactive Elements

Some elements should remain Material-UI:

```jsx
// Keep these as Material-UI
<Button variant="outlined" className="share-btn">
<IconButton>
<TextField>
<Menu>
<Accordion>
```

### Step 5: Hybrid Approach for Dynamic Styles

```jsx
// Use CSS class for static layout
// Use sx for dynamic/conditional styles
<div className="message-bubble">
  <Box sx={{ 
    opacity: isLoading ? 0.5 : 1,
    transition: 'opacity 0.3s'
  }}>
    {content}
  </Box>
</div>
```

---

## 📋 Migration Checklist

- [ ] Import `WorkflowStyles.css` at the top of component
- [ ] Replace main container `<Box>` with `<div className="main-workspace">`
- [ ] Convert navigation bar to `<div className="top-nav">`
- [ ] Convert breadcrumbs to use `.breadcrumb-item` classes
- [ ] Convert tabs to use `.pill-tabs` and related classes
- [ ] Convert stepper to use `.vertical-stepper` classes
- [ ] Convert messages to use `.message-bubble` classes
- [ ] Convert input bar to use `.chat-input-bar-container`
- [ ] Test layout at 1240px width
- [ ] Test responsive behavior
- [ ] Verify all colors match Figma (#00BCD4, #F8FAFC, etc.)
- [ ] Verify fonts (Geist, Inter)
- [ ] Test animations (spinner dots)
- [ ] Check z-index for dropdowns/modals

---

## 🎯 Common Patterns

### Pattern 1: Flex Containers

**BEFORE:**
```jsx
<Box sx={{
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px'
}}>
```

**AFTER:**
```css
.custom-flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
```

### Pattern 2: Badges

**BEFORE:**
```jsx
<Box sx={{
  width: 20,
  height: 20,
  borderRadius: '50%',
  bgcolor: '#00BCD4',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}}>
  <Typography sx={{ fontSize: '10px', color: '#FFF' }}>1</Typography>
</Box>
```

**AFTER:**
```jsx
<div className="num-badge">
  <span className="number">1</span>
</div>
```

### Pattern 3: Icons with Text

**BEFORE:**
```jsx
<Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
  <Icon sx={{ width: 12, height: 12 }} />
  <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Label</Typography>
</Box>
```

**AFTER:**
```jsx
<div className="tab-chat">
  <Icon className="icon" />
  <span className="label">Label</span>
</div>
```

---

## 🚨 Important Notes

1. **Preserve Interactivity**: Keep Material-UI for components that need:
   - onClick handlers
   - Hover states
   - Focus states
   - Transitions

2. **CSS Specificity**: If CSS classes aren't applying, check:
   - Import order (CSS should be imported early)
   - Specificity (CSS classes vs inline styles)
   - Material-UI's default styles

3. **Font Loading**: Ensure fonts are loaded in your main CSS or index.html:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
   <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet">
   ```

4. **Gradual Migration**: You can migrate section by section:
   - Start with navigation bar
   - Then stepper
   - Then messages
   - Finally input bar

---

## 🧪 Testing

After migration, verify:

1. **Visual Match**: Compare with Figma design
2. **Responsive**: Test at different screen sizes
3. **Animations**: Ensure spinner dots animate correctly
4. **Interactions**: All buttons and inputs work
5. **States**: Active, hover, disabled states work
6. **Performance**: Page loads quickly (CSS is faster than inline styles)

---

## 💡 Pro Tips

1. **Use Browser DevTools**: Inspect elements to see which styles are applied
2. **Create Custom Classes**: For one-off styles, add to WorkflowStyles.css
3. **Document Changes**: Add comments explaining custom modifications
4. **Keep Consistent**: Use CSS classes for all similar components
5. **Test Incrementally**: Migrate one component at a time

---

**Ready to Migrate?** Start with one section (like the navigation bar) and gradually work through the component!
