import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4',
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    table: {
      display: 'table',
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#000',
    },
    tableRow: {
      flexDirection: 'row',
    },
    tableCell: {
      padding: 5,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#000',
    },
  });

const SchoolReport = ({ report }) => (

    <Document>
   
   <View style={styles.section}>
        <Text>Table Example</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Assessment Name</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Score</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Grade</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Remarks</Text>
            </View>
          </View>
          {/* Add more rows here */}
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>English</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>72</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>A</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Distinction</Text>
            </View>
          </View>
          {/* Add more rows as needed */}
        </View>
      </View>
  </Document>
   
);

export default SchoolReport;
{
     {/* <Document>
        <Text style={styles.title}>Progress Report</Text>
        <View style={styles.header}>
            <Text style={styles.studentInfo}>
                Name of Student: {report.student_name}
            </Text>
            <Text style={styles.studentInfo}>
                Position in Class: {report.id}
            </Text>
        </View>
        <View style={styles.studentInfo}>
            <Text>Term: 1 Class: form 1</Text>
            <Text>Enrolment: 1 Class Teacher: {report.student_name}</Text>
        </View>
        <View style={styles.table}>
            <View style={styles.tableHeader}>
                <Text>Assessment Name</Text>
                <Text>Score</Text>
                <Text>Grade</Text>
                <Text>Remark</Text>
                <Text>Teacher</Text>
            </View>
        </View>
        <View style={styles.tableRow}>
            <Text>Overall</Text>
            <Text>{report.total_marks}</Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
        </View>
        {/* <View style={styles.section}>
            <Text>Report for {report.student_name}</Text>
            <Text>Student ID: {report.student_id}</Text>
            <Text>Class: {report.class}</Text>
            <Text>Total Marks: {report.total_marks}</Text>
            <Text>Subject Count: {report.subject_count}</Text>
        </View> */}
    // </Document> */}
}