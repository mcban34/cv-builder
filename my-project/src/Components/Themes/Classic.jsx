import React from 'react'
import { Font, Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';


function Classic({ userData, cvThemeData }) {
  console.log("classic çalıştı", userData, cvThemeData)

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4',
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
      fontFamily: 'Roboto'

    },
  });
  Font.register({
    family: "Roboto",
    src:
      "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
  });


  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>asıl amaç çoban rojin üğö</Text>
        </View>
        <View style={styles.section}>
          <Text>Deneyimleriniz ve Yetenekleriniz</Text>
        </View>
      </Page>
    </Document>
  );

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
      {/* <PDFViewer>
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
              <Text>Section #2</Text>
            </View>
          </Page>
        </Document>
      </PDFViewer> */}
      <PDFDownloadLink document={<MyDocument />} fileName="somename.pdf">
        {({ blob, url, loading, error }) =>
          loading ? 'Loading document...' : 'Download now!'
        }
      </PDFDownloadLink>

    </div>
  )
}

export default Classic