import React from "react";

// Import React-Bootstrap components
import { Container } from "react-bootstrap";

// Import Icons
// Import Styles
import styles from "./Loader.module.css";

const Loader: React.FC = () => {
    return (
        <Container className={styles.mainLoaderContainer}>
            <h3
                className={styles.loadingText}
            >
                Loading...
            </h3>
        </Container>
    )
}

export default Loader;