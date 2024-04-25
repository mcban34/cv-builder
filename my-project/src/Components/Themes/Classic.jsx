import React from 'react'
import { Font, Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';


function Classic({ userData, cvThemeData }) {
  console.log("classic çalıştı", userData, cvThemeData)

  // const styles = StyleSheet.create({
  //   page: {
  //     // flexDirection: 'row',
  //     fontSize: 12,
  //     padding: 5,
  //     backgroundColor: '#E4E4E4',
  //     fontFamily: 'Roboto'
  //   },
  //   section: {
  //     // margin: 10,
  //     // padding: 10,
  //     // flexGrow: 1,
  //   },
  // });
  // Font.register({
  //   family: "Roboto",
  //   src:
  //     "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
  // });

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFF',
      padding: 30
    },
    personalInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10
    },
    header: {
      fontSize: 24,
      fontFamily: 'Helvetica-Bold'
    },
    subHeader: {
      fontSize: 18,
      fontFamily: 'Helvetica'
    },
    text: {
      fontSize: 12,
      fontFamily: 'Helvetica'
    },
    section: {
      marginVertical: 10,
    },
    sectionHeader: {
      fontSize: 16,
      fontFamily: 'Helvetica-Bold',
      marginBottom: 5
    },
    listItem: {
      flexDirection: 'row',
      marginBottom: 5
    },
    bulletPoint: {
      width: 10,
      fontSize: 10,
    },
    listItemContent: {
      flex: 1,
    }
  });

  const MyDocument = ({ userData }) => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.personalInfo}>
          <Text style={styles.header}>{`${userData.personalInfo.firstName} ${userData.personalInfo.lastName}`}</Text>
          <Text style={styles.text}>{userData.personalInfo.phone} • {userData.personalInfo.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Summary</Text>
          <Text style={styles.text}>{userData.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Experience</Text>
          {userData.experience.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <View style={styles.listItemContent}>
                <Text style={styles.subHeader}>{item.position}, {item.companyName}</Text>
                <Text style={styles.text}>{item.startDate} - {item.endDate}</Text>
                <Text style={styles.text}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Education</Text>
          {userData.education.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <View style={styles.listItemContent}>
                <Text style={styles.subHeader}>{item.degree}, {item.fieldOfStudy}</Text>
                <Text style={styles.text}>{item.schoolName}</Text>
                <Text style={styles.text}>{item.startDate} - {item.endDate}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )

  return (
    <div className='container mx-auto'>
      <section className='personalInfo flex justify-between'>
        <div className='w-[20%]'>
          <img src={userData.personalInfo.image} width={200} alt="" />
        </div>
        <div className='w-[80%] flex justify-center'>
          <div className='w-[80%] text-center'>
            <h2 className='font-bold text-2xl'>{userData.personalInfo.firstName} {userData.personalInfo.lastName}</h2>
            <p>Phone : {userData.personalInfo.phone}</p>
            <p>Email : {userData.personalInfo.email}</p>
            <span>
              {userData.summary}
            </span>
          </div>
        </div>
      </section>

      <PDFDownloadLink document={<MyDocument userData={userData} />} fileName={`${userData.personalInfo.firstName}_${userData.personalInfo.lastName}.pdf`}>
        {({ blob, url, loading, error }) =>
          loading ? 'Loading document...' : 'Download now!'
        }
      </PDFDownloadLink>

    </div>
  )
}

export default Classic