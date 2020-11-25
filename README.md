# e-Flyer - An Online Graphic Editor

# Feature List
- [x] Add, remove, resize, reorder, clone, copy/paste and drag/drop elements
- [x] Drawing capability, with polygon, line, arrows and link support
- [x] Preview mode, tooltips, group/ungroup and zoom functionality
- [x] Upload (with drag/drop), import and export to JSON or image
- [x] Image cropping, Image filters, alignment, alignment guides
- [x] Snap to grid, context menu, animation and video element
- [x] Various icons in icon picker and fonts from Google Fonts (20)
- [x] HTML/CSS/JS Element, iFrame element
- [x] Animation support, with Fade / Bounce / Shake / Scaling / Rotation / Flash effects
- [x] Code Editor with HTML / CSS / JS / Preview
- [x] Various interaction modes, including grasp, selection, ctrl + drag grab
- [x] Multiple layouts, with fixed, responsive, fullscreen and grid modes
- [x] SVG, Chart and GIF elements
- [x] Undo/Redo support
- [ ] Wireframes - in development
- [ ] Multiple Map - in development
- [ ] Ruler - in development

# Installation

Run `npm install react-design-editor` or `yarn add react-design-editor`

# Getting Started

1. Create SSL certificate and setup the environment file (.env)
2. Run the App with `npm start` or `yarn start`
3. Open your web browser to `http://<your_PC_IP_address>:3000`

# Create SSL certificate

1. Open `Windows PowerShell` with administrator
2. Locate the path to the folder that use to store the certificate
3. Run the following command: `mkcert -key-file key.pem -cert-file cert.pem <your_PC_IP_address>`