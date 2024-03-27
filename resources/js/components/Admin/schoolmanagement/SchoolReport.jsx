import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

const SchoolReport = ({ report }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Report for {report.student_name}</Text>
        <Text>Student ID: {report.student_id}</Text>
        <Text>Class: {report.class}</Text>
        <Text>Total Marks: {report.total_marks}</Text>
        <Text>Subject Count: {report.subject_count}</Text>
      </View>
    </Page>
  </Document>
);

export default SchoolReport;
