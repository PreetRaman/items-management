# Proposal Management System

## Overview

The Proposal Management System is a web-based application built with Angular that allows users to manage, create, and interact with proposals related to cost-sharing among multiple parties. Users can create proposals, accept or reject them, and submit counter-proposals. The system ensures efficient management and tracking of proposals between various users, with real-time updates.

## Features
- **User Management**: Users can create and manage proposals, with each proposal being associated with specific parties.
- **Create Proposals**: Users can propose cost-sharing ratios for a selected item, specifying how much each party should pay.
- **Accept or Reject Proposals**: Users can either accept a proposal or reject it in favor of submitting a counter-proposal.
- **Counter-Proposal Submission**: Users can provide alternative cost-sharing proposals by rejecting and countering an existing proposal.
- **Proposal Notifications**: When all parties accept a proposal, it is marked as accepted, and alerts are shown.
- **User Role Management**: Users can only interact with proposals created by their own party, and the names of users from other parties are hidden.
- **Real-Time Updates**: The proposal list is automatically updated whenever a proposal is accepted or rejected.

## Requirements
- Angular CLI
- npm (Node Package Manager)

## Setup Instructions

### 1. Clone the repository
git clone https://github.com/PreetRaman/proposal-management.git

### 2. Install dependencies
cd proposal-management
npm install

### 3. Serve the application
ng serve

### Project Structure
Project Structure
- **src/app**: Contains all the Angular components, services, and models.
- **src/assets**: Contains static files like images or json files.
