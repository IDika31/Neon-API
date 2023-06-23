<br/>
<p align="center">
  <a href="https://github.com/IDika31/Neon-API">
    <img src="https://idika-rest-api-19af1e38caac.herokuapp.com/img/logo.png" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">Neon API</h3>

  <p align="center">
    Simplifying Data Access.
    <br/>
    <br/>
  </p>
</p>

![Downloads](https://img.shields.io/github/downloads/IDika31/Neon-API/total) ![Contributors](https://img.shields.io/github/contributors/IDika31/Neon-API?color=dark-green) ![Forks](https://img.shields.io/github/forks/IDika31/Neon-API?style=social) ![Stargazers](https://img.shields.io/github/stars/IDika31/Neon-API?style=social) ![Issues](https://img.shields.io/github/issues/IDika31/Neon-API) ![License](https://img.shields.io/github/license/IDika31/Neon-API) 

## Table Of Contents

* [About the Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Authors](#authors)

## About The Project

Neon API is a powerful and versatile project designed to provide seamless access to a wide range of anime-related information. Built upon the foundation of web scraping, the project harnesses the capabilities of scraping technologies to gather data from various anime websites that lack APIs. Additionally, it offers several other useful features, including real-time game username checks with integrated Redis support, eliminating the need for time-consuming requests.

##### Why Choose Neon API:

* **No API Dependency**: Many anime-related websites lack APIs, limiting the accessibility of their data. Neon API solves this challenge by leveraging web scraping techniques, ensuring that users can access information from a wide array of sources that would otherwise be unavailable through traditional API integration.
* **Faster Development**: By utilizing Neon API, developers can significantly reduce the time and effort required to gather anime-related data and implement additional functionalities. The integration of Redis for game username checks further optimizes performance, ensuring quick and efficient responses. This streamlined development process empowers developers to focus on building innovative features and creating engaging experiences for their users.

In summary, Neon API offers a robust solution for accessing anime-related information from websites without native APIs. With its extensive content, seamless integration capabilities, and efficient username checks, this project caters to the needs of developers, content creators, and anime enthusiasts alike, fostering a vibrant and thriving anime community.

## Built With

Neon API, is crafted using a powerful stack of technologies to ensure robustness, efficiency, and seamless functionality. The following cutting-edge technologies have been employed to create this exceptional solution:

* **Typescript**: A statically typed superset of JavaScript that enables developers to write clean, maintainable, and scalable code.
* **ExpressJS**: A fast and minimalist web application framework for Node.js that simplifies the creation of robust APIs and web services.
* **MongoDB**: A popular NoSQL database system that provides high performance, scalability, and flexibility for storing and retrieving data.
* **Redis**: An in-memory data structure store that accelerates data access, making it perfect for caching, session storage, and real-time applications.
* **Swagger**: An open-source framework that facilitates the design, building, documentation, and testing of APIs, ensuring consistency and ease of use.
* **Cheerio**: A fast and flexible HTML parsing library that simplifies data extraction from HTML documents, making web scraping tasks efficient and convenient.

## Getting Started

Getting started this project is a straightforward process. Follow the instructions below to set up the project locally and begin exploring its features.

### Prerequisites

Prerequisites

Before proceeding with the installation, ensure that you have the following prerequisites in place:

* **Node.js**: Make sure you have Node.js installed on your system. You can download and install Node.js from the official website (https://nodejs.org).
* **MongoDB**: Install MongoDB, a NoSQL database system, to store and retrieve data for the project. Visit the MongoDB website (https://www.mongodb.com) for installation instructions specific to your operating system.
* **Redis**: Install Redis, an in-memory data structure store, to enable fast data access and caching. Refer to the Redis website (https://redis.io) for installation guidelines tailored to your platform.

### Installation

To install and set up this project locally, follow these steps:

**1. Clone the repository**:

```sh
git clone https://github.com/IDika31/Neon-API.git
```
**2. Navigate to the project directory**:

```sh
cd Neon-API
```

**3. Install NPM packages:**

```sh
npm install
```

**4. Configure environment variables**:

Rename the .env.example file to .env in the project root directory and define the available variables with your values.

**5. Start the server**:

```sh
npm run dev
```

## Usage

The documentation for this project provides a detailed overview of all endpoints, their request and response structures, and additional guidelines for working with the API. It also includes code examples and further resources to assist developers in integrating the API into their applications.

You can access the documentation by visiting: [Documentation](https://idika-rest-api-19af1e38caac.herokuapp.com/api/v1/docs/)

Feel free to explore the documentation to understand the project's capabilities fully and make the most of its features.

## Roadmap

See the [open issues](https://github.com/IDika31/Neon-API/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.
* If you have suggestions for adding or removing projects, feel free to [open an issue](https://github.com/IDika31/Neon-API/issues/new) to discuss it, or directly create a pull request after you edit the *README.md* file with necessary changes.
* Please make sure you check your spelling and grammar.
* Create individual PR for each suggestion.

### Creating A Pull Request

**1. Fork the Repository**:
Fork the project's repository to your GitHub account by clicking on the "**Fork**" button located at the top-right corner of the repository page. This creates a copy of the project under your account.

**2. Clone the Repository**:
Clone the forked repository to your local machine using the following command:

```sh
git clone https://github.com/IDika31/Neon-API.git
```

**3. Create a New Branch**:
Move into the project's directory and create a new branch for your contribution:

```sh
cd Neon-API
git checkout -b feature/my-contribution  # Replace my-contribution with your contribution name
```

**4. Make the Necessary Changes**:
Make the desired changes to the project's codebase or documentation. Ensure that your changes align with the project's guidelines and follow best practices.

**5. Commit and Push Changes**:
Commit your changes with a descriptive commit message:

```sh
git add .
git commit -m "Add new feature"  # Replace with an appropriate commit message
git push origin feature/my-contribution  # Replace my-contribution with your contribution name
```
**5. Create a Pull Request**:
Go to the original repository on GitHub and navigate to the "**Pull Requests**" tab. Click on "**New Pull Request**" and provide a meaningful title and description for your contribution. Once submitted, your changes will be reviewed by the project maintainers.

Once your pull request is created, the project maintainers will review your changes, provide feedback, and merge them into the main repository if they meet the project's standards.

We appreciate your contributions and look forward to your involvement in enhancing this project!

## License

Distributed under the MIT License. See [LICENSE](https://github.com/IDika31/Neon-API/blob/main/LICENSE.md) for more information.

## Authors

* **IDika** - *Backend Developer* - [IDika](https://github.com/IDika31/) - *Build this project*
