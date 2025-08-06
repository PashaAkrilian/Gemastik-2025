# EcoSentra Firebase Integration (V0)

This document outlines the core concepts and workflow for connecting the EcoSentra application directly to Firebase services, including Cloud Firestore and Firebase Authentication.

---

### 1. Firebase Admin SDK Initialization (Server-side)

-   **Objective**: To grant the Next.js API server (API Routes) privileged access for read/write operations across all Firestore collections.
-   **Key Steps**:
    1.  Load service account credentials (Service Account Key), including `projectId`, `clientEmail`, and `privateKey`.
    2.  Initialize a single instance of the Admin SDK to prevent redundant connections.
    3.  Configure the `databaseURL` to match the `projectId`.
    4.  Export the Firestore instance for use throughout the API Routes.

---

### 2. Firebase Client SDK Initialization (Frontend)

-   **Objective**: To enable React/Next.js components to perform real-time operations (reads, snapshot subscriptions) directly with Firestore, and to integrate Firebase Authentication.
-   **Key Steps**:
    1.  Use public environment variables (`NEXT_PUBLIC_*`) for lightweight configuration: `apiKey`, `authDomain`, and `projectId`.
    2.  Initialize the Firebase app once on the client-side, ensuring no re-initialization during hot-reloading.
    3.  Export the Firestore instance for use in hooks or components for real-time queries, subscriptions, and CRUD functions.

---

### 3. API Route Design (Next.js API Routes)

-   **Objective**: To create a backend layer that manages data flow, validation, and authorization before interacting with Firestore.
-   **High-Level Structure**:
    1.  **HTTP Handlers**: Separate logic based on the request method (GET, POST, PUT, DELETE).
    2.  **Parameters**: Extract `userId` or `documentId` from the query or path for specific operations.
    3.  **Firestore Operations**:
        -   Read from the `fields` collection, filtering by `ownerRef` (using a `DocumentReference`).
        -   Add new documents using `collection.add(...)`, including data like `name`, `geometry`, and `timestamps`.
    4.  **Response Handling**: Return standard JSON data and HTTP status codes following REST conventions.
    5.  **Error Handling**: Reject unsupported methods with a 405 Method Not Allowed status.

---

### 4. Collection & Document Structure (Firestore Schema)

-   **users**: Stores user profiles, including name, role, and timestamps.
-   **fields**: Stores land-related data, including a reference to the user (`ownerRef`), land properties, geometry, and health scores.
-   **landCoverSnapshots**: A historical log of analysis snapshots (e.g., NDVI, carbon stock) linked to a `fieldRef` and date.
-   **alerts**: Documents for disaster warnings (e.g., fires, floods) with a `GeoPoint`, status, and an optional reference to a field.
-   **Other Collections**: `ecoServicesMetrics`, `decisions`, `exportRequests`, `chatSessions` as previously designed.

---

### 5. Security Rules & Indexing

-   **Security Rules**:
    -   Allow authenticated users to access only their own collections (e.g., `fields`, `decisions`).
    -   Make `alerts` publicly readable, but restrict write access to admin users only.
    -   Use `request.auth.uid` and compare it with `resource.data.ownerRef.id` for write control.

-   **Indexing**:
    -   Create a composite index on `landCoverSnapshots` for querying by `fieldRef` and `date`.
    -   Create an index on `alerts` to filter by `type` and `status`.

---

### 6. Required Environment Variables

| Variable | Value |
| :--- | :--- |
| `FIREBASE_PROJECT_ID` | `ecosentra` |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@ecosentra.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCw38wHyHz+MK40\nCEkUwQ7fkTxos9v61iL0Pe741Iu9ziLzsN3KkcfWNcuH+XEK3aYVGyJ30XkYXUHr\nWPbYBQ2VfoIbwZV45GPLuy7BzDdOeJ6Pbp+iWI27dpwLs9vW7nZC2zlEf/uh8S9z\nroQ+hwnEIuyJHtWK/Ba9hNXu6kPfKMUOMRb+GSxySmy70ykh4ri+oz4E8P24h39/\ntZLd7Vlg+lwmer8ezJv1HSuoqqqStzDpVEzflY40INtFhDOq1xljIl+oQ9xiSLEY\njdzqJGPdJqhQoHzABIzIo4WR3e2Zh54PFFsjxWyVAsimIA1OYIgwvFMqgjnfJXSh\nftdcJEIjAgMBAAECggEAHANbTCxGZ6KMJJ+J+5MsE4qWzQ/CGnM0gVxsbyqH9ggi\nOa2xzaB9zFZ5etADRbD0hJ6R50oyP1fzKx7MUaBTQMcS55R8Y55AlAbRu/iSazI9\nYq18SPkffCj9Q/k41fdZ8Z1zmilu+tIOgugz97c+0Q/68yitXOAviyqbu3A3pFiM\nCeVpDOscBfYfDysB1vsxdTjxgF0f/3L4Kdz+HmUMKTLEhjxLipaQU3VYWf8VUbOb\nidsCmzr9JJ1oGupJ3xDbEWUzLQ7BzHTH5DdHI79Za1rwBAqVz9Cn8WuLl477BoSj\nb0FuaPOuc+FRiH2qOtVNMcZ6w4mBCpkcUaxwDJpA2QKBgQDnsUMgytIeg/hkqRDY\nKzrAUgvjaEZh+Ksrlv5IZkfmx9KqUT/Swx9Qftmc1+mrhYyMU1lmb1gyK0iR7Ecb\nAy9etW7XXTDUB98AK/yFig5S6Y3hvlUsr/YBKuZGj0Mkl16Z1ELMCGIztTmMIz50\nh/PhRKmo3mEf1aZ9Zdpv9BYm5wKBgQDDbj2TwGP6YRGC0ztwZLiEXyXb3cmeOfAm\ngeoKcpHXwyaVWseieAVjFtLoTZLqucfeEtJqcLn71OPHR/9PnxADCQx2pwWcZ05M\nNuZQqozNCQdkGTKP9MzbEGFMxzNXAD6n6IT6ge2qWp/sQJrxQ5h2TuypaLlo7NuW\nfb8lZ9mvZQKBgQDHTVV4RN/gfhdSx5gEy5L7UtiFIvLAXf8oPPe54bniDGvsNH4Z\nV919CdE5uQV5lSTkpOIXWppcdZ00YTJ9Sw0ZhCq3uaNCEQ9D/5J2cN6Hdf6lfGua\nSDbupC937M6OEGPBIbTf/Co1XqQFJ2AXL8ebNMxYxgp4LvnLjq0LdsUDawKBgEtA\nIJ/K3fRj+g0o7uM5NT9rL7W4cdDmOE1risXZFcVB1JJ/8QzjMBfWiwF+FUsinA4r\nqy/nFgYdFFQAqhNriQvSKSVq7KMruB9qqEZ5VVwB1QG7HhgGR/c2GHEq5t7iLj4T\nL1kSPIRy/s9GlSK/R26Ot1wIAhSf13HcG4T4tv5tAoGAV+zKEtM8BpcRJYfA793q\n0dVUzTmfS9BeIjGbKH5uUDF955JUMMTM9v+SqCidbYYMISI2iq7I/uXSku5HlkSC\nBAf47e8mwgTrkujUNJWr7yiB7+2pzv2zKDsMA0pIskSKIGpgGqtMId6zw35hBhJ/\n6rajGe3C+6fmnlHy5GTr2/w=\n-----END PRIVATE KEY-----\n"` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyC8BXisa-00oo-51d5tQmI8I20aI4vgms` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `ecosentra.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `ecosentra` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `ecosentra.firebasestorage.app` |

> **Example `.env.local` contents**:
>
> ```dotenv
> FIREBASE_PROJECT_ID=ecosentra
> FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@ecosentra.iam.gserviceaccount.com
> FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCw38wHyHz+MK40\nCEkUwQ7fkTxos9v61iL0Pe741Iu9ziLzsN3KkcfWNcuH+XEK3aYVGyJ30XkYXUHr\nWPbYBQ2VfoIbwZV45GPLuy7BzDdOeJ6Pbp+iWI27dpwLs9vW7nZC2zlEf/uh8S9z\nroQ+hwnEIuyJHtWK/Ba9hNXu6kPfKMUOMRb+GSxySmy70ykh4ri+oz4E8P24h39/\ntZLd7Vlg+lwmer8ezJv1HSuoqqqStzDpVEzflY40INtFhDOq1xljIl+oQ9xiSLEY\njdzqJGPdJqhQoHzABIzIo4WR3e2Zh54PFFsjxWyVAsimIA1OYIgwvFMqgjnfJXSh\nftdcJEIjAgMBAAECggEAHANbTCxGZ6KMJJ+J+5MsE4qWzQ/CGnM0gVxsbyqH9ggi\nOa2xzaB9zFZ5etADRbD0hJ6R50oyP1fzKx7MUaBTQMcS55R8Y55AlAbRu/iSazI9\nYq18SPkffCj9Q/k41fdZ8Z1zmilu+tIOgugz97c+0Q/68yitXOAviyqbu3A3pFiM\nCeVpDOscBfYfDysB1vsxdTjxgF0f/3L4Kdz+HmUMKTLEhjxLipaQU3VYWf8VUbOb\nidsCmzr9JJ1oGupJ3xDbEWUzLQ7BzHTH5DdHI79Za1rwBAqVz9Cn8WuLl477BoSj\nb0FuaPOuc+FRiH2qOtVNMcZ6w4mBCpkcUaxwDJpA2QKBgQDnsUMgytIeg/hkqRDY\nKzrAUgvjaEZh+Ksrlv5IZkfmx9KqUT/Swx9Qftmc1+mrhYyMU1lmb1gyK0iR7Ecb\nAy9etW7XXTDUB98AK/yFig5S6Y3hvlUsr/YBKuZGj0Mkl16Z1ELMCGIztTmMIz50\nh/PhRKmo3mEf1aZ9Zdpv9BYm5wKBgQDDbj2TwGP6YRGC0ztwZLiEXyXb3cmeOfAm\ngeoKcpHXwyaVWseieAVjFtLoTZLqucfeEtJqcLn71OPHR/9PnxADCQx2pwWcZ05M\nNuZQqozNCQdkGTKP9MzbEGFMxzNXAD6n6IT6ge2qWp/sQJrxQ5h2TuypaLlo7NuW\nfb8lZ9mvZQKBgQDHTVV4RN/gfhdSx5gEy5L7UtiFIvLAXf8oPPe54bniDGvsNH4Z\nV919CdE5uQV5lSTkpOIXWppcdZ00YTJ9Sw0ZhCq3uaNCEQ9D/5J2cN6Hdf6lfGua\nSDbupC937M6OEGPBIbTf/Co1XqQFJ2AXL8ebNMxYxgp4LvnLjq0LdsUDawKBgEtA\nIJ/K3fRj+g0o7uM5NT9rL7W4cdDmOE1risXZFcVB1JJ/8QzjMBfWiwF+FUsinA4r\nqy/nFgYdFFQAqhNriQvSKSVq7KMruB9qqEZ5VVwB1QG7HhgGR/c2GHEq5t7iLj4T\nL1kSPIRy/s9GlSK/R26Ot1wIAhSf13HcG4T4tv5tAoGAV+zKEtM8BpcRJYfA793q\n0dVUzTmfS9BeIjGbKH5uUDF955JUMMTM9v+SqCidbYYMISI2iq7I/uXSku5HlkSC\nBAf47e8mwgTrkujUNJWr7yiB7+2pzv2zKDsMA0pIskSKIGpgGqtMId6zw35hBhJ/\n6rajGe3C+6fmnlHy5GTr2/w=\n-----END PRIVATE KEY-----\n"
> NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC8BXisa-00oo-51d5tQmI8I20aI4vgms
> NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ecosentra.firebaseapp.com
> NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecosentra
> NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ecosentra.firebasestorage.app
> ```

---

### 7. Prompt for V0 Code Generation

Below is a prompt that can be used with a V0 model to automatically generate the necessary Node.js scripts (`seedFirestore.js` and Firebase configuration) based on the information provided above:

Create a Node.js script named `seedFirestore.js` that automatically sets up and seeds a Firebase Firestore database for the EcoSentra project. The script must:

1.  Load environment variables from a `.env.local` file (using the `dotenv` package). The required variables are:
    *   `FIREBASE_PROJECT_ID`
    *   `FIREBASE_CLIENT_EMAIL`
    *   `FIREBASE_PRIVATE_KEY` (as a multi-line string with `\n` for newlines)

2.  Initialize the Firebase Admin SDK once, using the service account credentials loaded from the environment variables.

3.  Implement seeding functions for each of the main collections (`users`, `fields`, `landCoverSnapshots`, `alerts`, `ecoServicesMetrics`, `decisions`, `exportRequests`, `chatSessions`) according to the described schema:
    *   **`users`**: Create a sample admin user document.
    *   **`fields`**: Create a sample document with a reference to `users/admin`.
    *   Add similar functions for the other collections with simple placeholder data.

4.  In a `main()` function, execute all the seeding functions and log the results.

5.  Ensure that the collection structure is automatically created by Firestore when the first `set` or `add` operation is performed.

6.  Include basic error handling and exit the process with code 0 or 1.

Write the complete script, ready to be executed with `node scripts/seedFirestore.js`.
