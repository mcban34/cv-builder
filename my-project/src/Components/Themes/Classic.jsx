import React from 'react'
import { Font, Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink, Image } from '@react-pdf/renderer';
import useUserStore from '../../store/useUserStore';


function Classic({ userData, cvThemeData }) {
  const { localImage, updateLocalImage } = useUserStore();

  Font.register({
    family: "Roboto",
    src:
      "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
  });

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFF',
      padding: 20,
      fontFamily: 'Roboto'
    },
    personalInfo: {
      flexDirection: 'row',
      marginBottom: 5
    },
    image: {
      width: 100,
      height: 100,
      marginRight: 20,
      borderRadius: 50
    },
    name: {
      fontSize: 15,
      fontWeight: 'bold'
    },
    contactInfo: {
      fontSize: 12,
      color: '#666'
    },
    section: {
      marginVertical: 5
    },
    sectionHeader: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5
    },
    listItem: {
      flexDirection: 'row',
      marginBottom: 5
    },
    bulletPoint: {
      width: 10,
      fontSize: 10,
      marginRight: 2
    },
    listItemContent: {
      flex: 1
    },
    jobTitle: {
      fontSize: 12,
      fontWeight: 'bold'
    },
    company: {
      fontSize: 14,
      color: '#666'
    },
    dateRange: {
      fontSize: 10,
      color: '#999'
    },
    description: {
      fontSize: 10
    },
    personalText: {
      marginTop: 20
    },
    skills: {
      flexDirection: 'row',
      fontSize: 12
    },
    projectDesc: {
      fontSize: 10,
      color: '#666'
    }

  });

  const MyDocument = ({ userData }) => (
    <Document>
      <Page style={styles.page}>
        {/* Kişisel */}
        <View style={styles.personalInfo}>
          <Image
            style={styles.image}
            src={userData.personalInfo.image}
            allowDangerousPaths={true}
          />
          <View style={styles.personalText}>
            <Text style={styles.name}>{`${userData.personalInfo.firstName} ${userData.personalInfo.lastName}`}</Text>
            <Text style={styles.contactInfo}>{userData.personalInfo.phone} • {userData.personalInfo.email}</Text>
          </View>
        </View>

        {/* Açıklama */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Summary</Text>
          <Text style={styles.description}>{userData.summary}</Text>
        </View>

        {/* Deneyim */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Experience</Text>
          {userData.experience.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <View style={styles.listItemContent}>
                <Text style={styles.jobTitle}>{item.companyName} - {item.position}</Text>
                {/* <Text style={styles.company}></Text> */}
                <Text style={styles.dateRange}>{item.startDate} - {item.endDate}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Mezuniyet */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Education</Text>
          {userData.education.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <View style={styles.listItemContent}>
                <Text style={styles.company}>{item.fieldOfStudy}</Text>
                <Text style={styles.dateRange}>{item.startDate} - {item.endDate}</Text>
                <Text style={styles.description}>{item.schoolName} - {item.degree}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Projeler */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Projects</Text>
          {userData.projects.map((project, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <View style={styles.listItemContent}>
                <Text style={styles.jobTitle}>{project.projectName}</Text>
                <Text style={styles.projectDesc}>{project.description}</Text>
                <Text style={styles.description}>URL: {project.url}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Beceriler */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Skills</Text>
          <View style={styles.skills}>
            {userData.skills.map((skill, index) => (
              <Text key={index} >{skill}, </Text>
            ))}
          </View>
        </View>

        {/* Diller */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Languages</Text>
          <View style={styles.skills}>
            {userData.languages.map((language, index) => (
              <Text key={index} style={styles.description}>{language}, </Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )

  return (
    <div className='container mx-auto'>
      <div className='h-[70vh]'>
        <PDFViewer
          showToolbar={false}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <MyDocument userData={userData} />
        </PDFViewer>
      </div>

      <div className='mt-5 flex justify-center'>
        <PDFDownloadLink className='bg-green-500 text-white p-5 rounded-xl' document={<MyDocument userData={userData} />} fileName={`${userData.personalInfo.firstName}_${userData.personalInfo.lastName}.pdf`}>
          {({ blob, url, loading, error }) =>
            loading ? 'Loading document...' : 'Download now!'
          }
        </PDFDownloadLink>
      </div>

    </div>
  )
}

export default Classic