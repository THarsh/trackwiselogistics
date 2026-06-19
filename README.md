# Smart Logistics Tracking System

Smart Logistics Tracking System is a React-based web application developed for a software application development assessment. The system is based on a logistics company use case where shipment tracking, driver communication, delivery instructions, and customer notifications need to be improved.

The application uses Firebase as the backend service. Firebase Authentication is used for login, Cloud Firestore is used to store shipment and user role data, and EmailJS is used to send email notifications when delivery instructions are updated.

## Project Overview

The client is a small logistics company that currently manages deliveries manually using spreadsheets, phone calls, and printed delivery lists. This causes delays, communication issues, and difficulty tracking shipment status.

This project provides a digital solution where users can:

- Login securely
- Search shipments using a tracking ID
- View shipment details
- Update special delivery instructions
- Send email notifications to customers
- Add new shipment records
- Restrict some features based on user roles

## Features

- Firebase email/password authentication
- Role-based access control using Firestore
- Admin-only Add Shipment page
- Shipment search by tracking ID
- Shipment details display from Firestore
- Update special instructions using an Ant Design popup modal
- Send customer email notification using EmailJS
- Add new shipment records to Firestore
- Ant Design user interface
- Logout functionality

## User Roles

| Role       | Access                                            |
| ---------- | ------------------------------------------------- |
| Admin      | Dashboard, Add Shipment page, update instructions |
| Driver     | Dashboard only                                    |
| Dispatcher | Dashboard only                                    |
| Manager    | Dashboard only                                    |

Only users with the `admin` role can access the Add Shipment page.

## Technologies Used

- React
- JavaScript
- Vite
- Firebase Authentication
- Firebase Cloud Firestore
- EmailJS
- Ant Design
- React Router DOM

## Project Structure

```text
src
├── components
│   └── ProtectedRoute.jsx
├── pages
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── AddShipment.jsx
├── firebase.js
├── App.jsx
└── main.jsx
```

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

Install dependencies:

```bash
npm install
```

Install required packages if they are not already installed:

```bash
npm install firebase react-router-dom antd @ant-design/icons @emailjs/browser
```

Start the development server:

```bash
npm run dev
```

Open the local development URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Firebase Setup

### 1. Create Firebase Project

Create a Firebase project from the Firebase Console.

### 2. Enable Firebase Authentication

Go to:

```text
Firebase Console → Authentication → Sign-in method
```

Enable:

```text
Email/Password
```

Create test users, for example:

| Email               | Password | Role       |
| ------------------- | -------- | ---------- |
| admin@test.com      | 123456   | admin      |
| driver@test.com     | 123456   | driver     |
| dispatcher@test.com | 123456   | dispatcher |
| manager@test.com    | 123456   | manager    |

Firebase Authentication does not directly store roles. Roles are stored separately in Firestore.

### 3. Create Firestore Database

Create a Firestore database and add these collections:

```text
shipments
users
```

## Firestore Data Structure

### Shipments Collection

Collection name:

```text
shipments
```

Example document ID:

```text
TRK1001
```

Example fields:

```text
trackingId: TRK1001
customerName: Sarah Johnson
email: customer@test.com
driverName: Kasun Perera
status: Pending
currentLocation: Colombo Warehouse
eta: 2026-06-20 14:30
address: No 25, Colombo
specialInstructions: Leave at front desk
createdAt: timestamp
updatedAt: timestamp
```

### Users Collection

Collection name:

```text
users
```

The document ID must be the Firebase Authentication user UID.

Example:

```text
users / AUTH_USER_UID
```

Example admin user fields:

```text
name: Admin User
email: admin@test.com
role: admin
```

Example driver user fields:

```text
name: Driver User
email: driver@test.com
role: driver
```

## Firebase Configuration

Create a file:

```text
src/firebase.js
```

Example:

```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
```

Replace the Firebase configuration values with your own Firebase project values.

## EmailJS Setup

EmailJS is used to send email notifications when special delivery instructions are updated.

### EmailJS Template Variables

Create an EmailJS template with the following variables:

```text
{{to_email}}
{{customer_name}}
{{tracking_id}}
{{status}}
{{driver_name}}
{{current_location}}
{{eta}}
{{special_instructions}}
```

### EmailJS Subject

```text
Delivery Instructions Updated - {{tracking_id}}
```

### EmailJS Email Body

```text
Hello {{customer_name}},

Your delivery instructions have been updated.

Tracking ID: {{tracking_id}}
Status: {{status}}
Driver: {{driver_name}}
Current Location: {{current_location}}
ETA: {{eta}}

Updated Special Instructions:
{{special_instructions}}

Thank you,
Smart Logistics Team
```

In the EmailJS template recipient field, use:

```text
{{to_email}}
```

### EmailJS Configuration in Code

In `Dashboard.jsx`, replace these values with your EmailJS account values:

```js
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
```

Do not use a private key in the frontend.

## Application Routes

| Route           | Description                          | Access              |
| --------------- | ------------------------------------ | ------------------- |
| `/login`        | User login page                      | Public              |
| `/dashboard`    | Shipment search and update dashboard | Authenticated users |
| `/add-shipment` | Add new shipment form                | Admin only          |

## How to Use

### 1. Login

Go to:

```text
/login
```

Login using a Firebase Authentication user.

Example:

```text
Email: admin@test.com
Password: 123456
```

### 2. Search Shipment

On the dashboard, enter a tracking ID such as:

```text
TRK1001
```

Click Search.

The system retrieves shipment details from Firestore.

### 3. Update Special Instructions

In the shipment details section, click the Update button on the Special Instructions row.

Enter the updated instruction and click:

```text
Save & Send Email
```

The system will:

1. Save the updated instruction in Firestore.
2. Send an email notification to the customer using EmailJS.

### 4. Add New Shipment

Only admin users can access this feature.

Click:

```text
Add Shipment
```

Fill in the shipment details and save. The new shipment will be stored in Firestore and can be searched using the tracking ID.

## Testing

| Test Case                         | Expected Result                 | Status |
| --------------------------------- | ------------------------------- | ------ |
| Login with valid user             | User is redirected to dashboard | Pass   |
| Login with invalid user           | Error message is displayed      | Pass   |
| Search valid tracking ID          | Shipment details are displayed  | Pass   |
| Search invalid tracking ID        | Error message is displayed      | Pass   |
| Update special instructions       | Firestore data is updated       | Pass   |
| Send EmailJS notification         | Customer receives email         | Pass   |
| Admin opens Add Shipment page     | Page loads successfully         | Pass   |
| Non-admin opens Add Shipment page | User is redirected to dashboard | Pass   |
| Add new shipment                  | Shipment is saved in Firestore  | Pass   |

## Assessment Alignment

This project supports the following logistics company use cases:

### Customer Shipment Tracking

Users can search a shipment using a tracking ID and view shipment details.

### Delivery Instructions

Special delivery instructions can be added or updated.

### Automated Notifications

When instructions are updated, an email notification is sent to the customer.

### Shipment Management

Admin users can add new shipment records to the system.

### Role-Based Access

Only admin users can access shipment creation functionality.

## Design Decisions

Firebase was selected as the backend service to reduce backend development complexity. Instead of building a custom REST API, the React application communicates directly with Firebase using the Firebase SDK.

Cloud Firestore was selected because it provides a flexible NoSQL database structure suitable for storing shipment records and user roles.

Firebase Authentication was used for login because it provides a simple and secure authentication system for email/password users.

Ant Design was used for the user interface because it provides professional, responsive, and reusable UI components.

EmailJS was used for prototype email notifications because it allows the application to send customer notification emails without building a separate backend server.

## Limitations

- User roles are stored in Firestore instead of Firebase custom claims.
- EmailJS is suitable for a prototype, but production systems should use a backend email service.
- Dashboard statistics are currently static and can be improved using Firestore aggregation.
- Real GPS map tracking is not included in the current version.
- Route optimization is not included in the current version.
- QuickBooks integration is not included in the current version.

## Future Improvements

- Add real-time shipment updates using Firestore `onSnapshot`.
- Add live GPS tracking with Google Maps or Leaflet.
- Add driver dashboard for updating delivery statuses.
- Add dispatcher dashboard to view all shipments.
- Add manager reports with charts and export options.
- Add Firebase Security Rules for stronger role-based database access.
- Replace EmailJS with Firebase Cloud Functions and SendGrid for production email sending.
- Add proof of delivery using photo upload or digital signature.
- Add QuickBooks integration for invoicing.

## Conclusion

The Smart Logistics Tracking System demonstrates a working software application based on a logistics company use case. It includes authentication, role-based routing, shipment tracking, shipment creation, special instruction updates, and email notifications. The project shows how React, Firebase, Ant Design, and EmailJS can be combined to create a functional logistics management prototype.
