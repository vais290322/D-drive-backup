import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  Canvas,
  Path,
  Rect,
  Circle,
  Ellipse,
  Line,
  Polyline,
  Polygon,
  G,
  ClipPath,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Tspan,
  Font,
  StyleSheet
} from '@react-pdf/renderer';

// Register a custom font (optional)
Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

// Styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    fontFamily: 'Oswald'
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    border: '1pt solid #ccc'
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
    color: '#333'
  },
  text: {
    fontSize: 12,
    color: '#555'
  },
  link: {
    color: 'blue',
    textDecoration: 'underline'
  },
  image: {
    width: 100,
    height: 60,
    marginVertical: 8
  },
  shapes: {
    height: 150,
    width: '100%',
    backgroundColor: '#eee'
  }
});

const AllTagsExample = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.title}>All React-PDF Tags & Styles</Text>
        </View>

        {/* Text examples */}
        <View style={styles.section}>
          <Text style={styles.text}>Normal text</Text>
          <Text style={[styles.text, ]}>Bold text</Text>
          <Text style={[styles.text, { fontStyle: 'italic' }]}>Italic text</Text>
          <Text style={[styles.text, { textDecoration: 'underline' }]}>Underlined text</Text>
          <Text style={[styles.text, { color: 'red' }]}>Colored text</Text>
          <Text>
            <Tspan style={{ color: 'green' }}>Tspan part</Tspan> and normal part.
          </Text>
        </View>

        {/* Link example */}
        <View style={styles.section}>
          <Text>
            Visit <Link src="https://react-pdf.org" style={styles.link}>React PDF Docs</Link>
          </Text>
        </View>

        {/* Image example */}
        <View style={styles.section}>
          <Image
            style={styles.image}
            src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
          />
        </View>

        {/* Shapes via Canvas */}
        <View style={styles.section}>
          <Canvas style={styles.shapes}>
            <Path d="M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80" stroke="blue" fill="none" />
            <Rect x="200" y="20" width="60" height="40" stroke="red" fill="yellow" />
            <Circle cx="320" cy="50" r="20" fill="green" />
            <Ellipse cx="400" cy="50" rx="30" ry="15" fill="orange" />
            <Line x1="10" y1="120" x2="150" y2="120" stroke="black" />
            <Polyline points="200,120 240,160 280,120" stroke="purple" fill="none" />
            <Polygon points="350,120 380,160 320,160" fill="pink" stroke="black" />
          </Canvas>
        </View>

        {/* Gradient example */}
        <View style={styles.section}>
          <Canvas style={styles.shapes}>
            <Defs>
              <LinearGradient id="grad1" from="#ff0000" to="#0000ff">
                <Stop offset="0" stopColor="red" />
                <Stop offset="1" stopColor="blue" />
              </LinearGradient>
            </Defs>
            <Rect x="10" y="10" width="100" height="100" fill="url(#grad1)" />
          </Canvas>
        </View>
      </Page>
    </Document>
  );
};

export default AllTagsExample;
