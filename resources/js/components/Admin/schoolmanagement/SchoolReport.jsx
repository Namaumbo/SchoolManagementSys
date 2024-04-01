import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        backgroundColor: "#E4E4E4",
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
        border: "1px solid black",
    },
    box: {
        border: "1px solid black",
    },
    title: {
        alignItems: "center",
        fontSize: "20px",
    },
    header: {
        backgroundColor: "grey",
        alignItems: "center",
        fontWeight: "bold",
    },
    studentInfo: {
        fontSize: 12,
    },
    table: {
        flexDirection: "column",
    },
    tableHeader: {
        flexDirection: "row",
        justifyContent: "spaceBetween",
        width: "100%",
        borderRight: 1,
        fontSize: 15,
    },
    tableRow: {
        flexDirection: "row",
        justifyContent: "spaceBetween",
        borderBottom: 1,
    },
});

const SchoolReport = ({ report }) => (
    <Document>
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
    </Document>
);

export default SchoolReport;
