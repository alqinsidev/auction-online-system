# Online Auction System

  



## Introduction

  

The Online Auction System is a full-stack project that utilizes various technologies and frameworks to create a comprehensive and efficient online auction platform. The key technologies used in this project are:

  

  

-  **React**: A popular JavaScript library for building user interfaces, used for the frontend development of the Online Auction System. React allows for the creation of dynamic and responsive UI components.





-  **Ant Design (Antd)**: A widely adopted UI framework that provides a set of high-quality and customizable React components. Antd is used in the Online Auction System to create a visually appealing and user-friendly interface. It offers a wide range of components, including forms, tables, modals, and navigation elements, which enhance the overall user experience.





-  **NestJS**: A progressive Node.js framework used for building efficient, scalable, and modular backend applications. NestJS provides a solid foundation for developing the backend of the Online Auction System, offering features such as dependency injection, decorators, and powerful routing capabilities.





-  **PostgreSQL**: A powerful open-source relational database management system used to store and manage the project's data. PostgreSQL offers robust data integrity, ACID compliance, and support for advanced SQL queries, making it an excellent choice for storing auction-related information.





-  **TypeORM**: A TypeScript-based object-relational mapping (ORM) library that simplifies database integration and management. TypeORM provides a convenient way to interact with the PostgreSQL database and handle database operations using object-oriented programming paradigms.





-  **RabbitMQ**: A popular message broker that facilitates reliable messaging between different parts of the system. In the Online Auction System, RabbitMQ is utilized to handle the closing of bids at a specified time in the future, ensuring accurate and timely completion of auctions.





-  **Socket.IO**: A real-time communication library that enables bidirectional and event-based communication between the server and the clients. Socket.IO is employed in the Online Auction System to handle real-time bidding and bid status updates. It allows users to participate in auctions, place bids, and receive instant updates on bid activity, ensuring an interactive and engaging bidding experience.





-  **Sentry.io**: An error monitoring and logging platform that ensures effective error tracking and logging in the Online Auction System. Sentry.io captures and analyzes errors and exceptions occurring in both the frontend and backend components, providing real-time error tracking and performance monitoring. This helps in identifying and resolving issues promptly, improving system stability and user experience.





By leveraging these technologies, including the use of Socket.IO for real-time bidding and bid status updates, and Sentry.io for error and logging management, the Online Auction System provides a visually appealing, responsive, and user-friendly auction platform. Users can actively participate in auctions, place bids, and receive immediate notifications on bid updates, while ensuring efficient error tracking and issue resolution for a seamless user experience.





## System Design and ERD





-  **System Design**: The system design of the Online Auction System incorporates a React front end connected to a NestJS backend via HTTP and WebSocket, with data stored in a PostgreSQL database. The backend also integrates with RabbitMQ using AMQP to facilitate efficient bid closing. This design ensures a seamless user experience, real-time bid updates, and reliable data storage and retrieval.





![system](https://github.com/alqinsidev/auction-online-system/blob/main/docs/image/System%20Design.jpeg)





-  **ERD**:Here the database design for this project





![ERD](https://github.com/alqinsidev/auction-online-system/blob/main/docs/image/erd.jpeg)





## Online Version




> NOTE: Deprecated

The Online Auction System is also available online, deployed on Amazon EC2 as a Docker container. You can access the online version of the system [here](http://18.138.252.135:8080/home). Feel free to explore the features and functionalities of the system.





## Installation



1. Clone the repository: `git clone https://github.com/alqinsidev/auction-online-system`



2. Install frontend dependencies: `cd frontend && npm install`



3. Install backend dependencies: `cd backend && npm install`



4. Set up the PostgreSQL database with the required credentials and create a new database (if not already created).



5. Configure the backend environment:



- Rename the `.env.example` file in the `backend` and `frontend` directory to `.env`.



- Open the `.env` file and set everything to your own environment



6. Migrate the database schema:



- Run the migration command: `cd backend && npm run migrate`.



- This command will create the necessary tables and schema in the specified database.


7. Run RabbitMQ with rabbitmq_delayed_message_exchange enabled:

- You can use docker container version by running `docker run -d --name rabbitmq-broker -p  5672:5672 -p 15672:15672 alqinsidev/rabbitmq-delay-feature`


## Getting Started
In order to run the project you have 2 option

### Running project sepparetly

1. Start the frontend server: `cd frontend && npm preview`



2. Start the backend server: `cd backend && npm start`



3. Access the application in your browser at `http://localhost:5173`.

  >This system need RabbitMQ with rabbitmq_delayed_message_exchange  plugin enabled in order to auto close the auction when the time is over.

  ### Running as a docker container
  1. Set all env file at `/docker/env` folder

  2. Run docker compose command `cd docker && docker-compose up -d`

4. Access the application in your browser at `http://localhost:8080`

## Testing



> This Project aims to provide an overview of the unit testing process for the components. It is important to note that not all components currently have unit tests in place.



This project utilizes [jest](https://jestjs.io) for backend testing and [vitest](https://vitest.dev) for frontend testing.



1. Testing the Backend: `cd backend && npm test`



2. Testing the Frontend: `cd frontend && npm test`





# The Auction





## Realtime Update





The Online Auction System provides various features to monitor bids and auctions:





-  **Real-time Bid Updates**: The system utilizes Socket.IO to provide real-time bid updates to users. Users can view the current highest bid and any new bids placed by other participants without manually refreshing the page. The bid status updates dynamically, ensuring users stay informed about the auction progress.





-  **Auction Timer**: The system displays an auction timer that counts down the remaining time until the auction ends. Users can see the time remaining for bidding and make informed decisions accordingly.





With these monitoring features, users can actively participate in auctions, stay updated on bid activity, and make well-informed bidding decisions.





## Listing Items and Bidding





The Online Auction System allows users to list their items for auction and participate in bidding. Here's a brief overview of the listing and bidding process:





### Listing Items



1. Sign in to the Online Auction System using your registered account.



2. Navigate to the "My Item" section by hovering your name on the header.



3. Create a new item and fill in the necessary details for the item such as item name, description, base price and also time window.




4. Once user submit the item, it will save as a draft.


5. User item will not be listed on the auction unless the user publish their item.





### Bidding on Items



1. Before placing a bid on an item, users are required to submit a deposit.



2. The deposit amount is deducted from the user's account balance and held by the system until the auction for the item is over.



3. If another user places a higher bid during the auction, the system will hold the deposit of the previous bidder.



4. When the auction ends, the user with the highest bid is declared the winner and is required to pay the bid amount for the item.



5. The system deducts the bid amount from the winner's account balance, and the item is awarded to them.



6. After the auction ends, the system initiates the refund process for users who did not win the auction.



7. The deposit is refunded to the accounts of the non-winning users, and the funds are available in their account balances.

  

8. This deposit mechanism ensures that the user with the highest bid pays for the item, and the deposit is refunded to non-winning users only after the auction is closed to prevent bid and run.

  



## Future Work

  



As the Online Auction System evolves, there are several areas that can be improved and enhanced. Some work in progress includes:



  

-  **Unit Testing**: Testing untested componnents / function.



-  **Fixing Missing Interfaces**: Addressing any missing interfaces or inconsistencies throughout the program.

  

-  **CI/CD**: Implementing CI/CD to improve the deployment speed and automation process on the system
