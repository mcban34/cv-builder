import React from 'react'
import { Font, Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink, Image } from '@react-pdf/renderer';
import useUserStore from '../../store/useUserStore';


function Modern({ userData, cvThemeData }) {
  const { localImage, updateLocalImage } = useUserStore();

  console.log("userData", userData);

  Font.register({
    family: "Roboto",
    src:
      "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
  });

  const icons = {
    email: 'https://img.icons8.com/ios-filled/50/000000/email.png',
    phone: 'https://img.icons8.com/ios-filled/50/000000/phone.png',
    linkedin: 'https://img.icons8.com/ios-filled/50/000000/linkedin.png',
  };

  // Stiller
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#f0f0f0',
      fontFamily: "Roboto"
    },
    sidebar: {
      width: '35%',
      backgroundColor: '#283593',
      padding: 10,
      color: '#fff',
    },
    main: {
      width: '65%',
      padding: 20,
    },
    name: {
      fontSize: 20,

      marginBottom: 10,
    },
    role: {
      fontSize: 18,

      marginBottom: 10,
    },
    contactInfo: {
      marginBottom: 10,
    },
    contactText: {
      fontSize: 12,

      marginBottom: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    contactIcon: {
      width: 12,
      height: 12,
      marginRight: 8,
    },
    section: {
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 18,

      color: '#283593',
      marginBottom: 10,
    },
    text: {
      fontSize: 12,

      marginBottom: 10,
    },
    skill: {
      backgroundColor: '#283593',
      color: '#fff',
      padding: 3,
      borderRadius: 4,
      margin: 2,
      fontSize: 10,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    profileImage: {
      borderRadius: 100,
      marginBottom: 10
    },
    marginT: {
      paddingTop: 3
    },
    skills: {
      flexDirection: 'row',
      fontSize: 12
    },
  });

  const MyDocument = ({ userData }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <Image style={styles.profileImage} src={userData.personalInfo.image} />
          <Text style={styles.name}>{userData.personalInfo.firstName} {userData.personalInfo.lastName}</Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactText}>
              <Image style={styles.contactIcon} src={icons.email} />
              <Text>{userData.personalInfo.email}</Text>
            </View>
            <View style={styles.contactText}>
              <Image style={styles.contactIcon} src={icons.phone} />
              <Text>{userData.personalInfo.phone}</Text>
            </View>
          </View>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {userData.skills.map((skill, index) => (
              <Text style={styles.skill} key={index} >{skill}</Text>
            ))}
          </View>
        </View>
        <View style={styles.main}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <Text style={styles.text}>
              {userData.summary}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <Text style={styles.text}>
              {
                userData.experience.map(item => (
                  <>
                    <Text style={{ fontSize: 14 }}>
                      {item.position} at {item.companyName}
                    </Text>
                    {'\n'}{item.startDate} - {item.endDate}{'\n'}
                    {item.description}
                  </>
                ))
              }
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {userData.education.map((item, index) => (
              <Text key={index} style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>{item.fieldOfStudy}</Text> {'\n'}
                <Text >{item.startDate} - {item.endDate}</Text> {'\n'}
                <Text >{item.schoolName} - {item.degree}</Text> {'\n'}
              </Text>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {userData.projects.map((item, index) => (
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>{item.projectName}</Text> {'\n'}
                <Text style={styles.marginT}>{item.description}</Text> {'\n'}
                <Text >URL: {item.url}</Text> {'\n'}
              </Text>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.skills}>
              {userData.languages.map((language, index) => (
                <Text key={index} style={styles.description}>{language}, </Text>
              ))}
            </View>
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

export default Modern