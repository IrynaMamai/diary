import React from 'react'
import { Share, ScrollView } from 'react-native'
import { Appbar, Title, Card, Paragraph } from 'react-native-paper'

import { useSelector } from 'react-redux'
import styled, { ThemeProvider } from "styled-components"

import { useTranslation } from 'react-i18next'
import '../translete/i18n'


function OpenNote({ navigation }) {
    const { t , i18n} = useTranslation();

    const theme = useSelector((state) => state.themeReducer.theme)

    const note = navigation.getParam('note');
    const id = note.id;
    const url = note.url

    function onDeleteNote() {
        navigation.state.params.deleteNote(id)
        navigation.goBack()
    }

    const editNote = (note) => {
        navigation.state.params.editNote(note.note)
        navigation.navigate('ViewNotes')
    }

    async function sharing() {
        try {
            const result = await Share.share({
                url: url,
                message: "Title: " + note.title + "\n" + "Description: " + note.description
            });


        } catch (error) {
            alert(error.message);
        }
    };

    const isImageNotNull = () => {
        if (url) {
            return (

                <Card.Cover source={{ uri: url }} />


            )
        }
    }


    return (
        <ThemeProvider theme={theme}>
            <Appbar.Header style={{ backgroundColor: theme.PRIMARY_HEADER_COLOR }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={t("~ DIARY ~")}></Appbar.Content>
                <Appbar.Action icon="share-variant" onPress={() => sharing()} />
                <Appbar.Action icon="tooltip-edit" onPress={() => navigation.navigate('AddNotes', { note: note, editNote: editNote })} />
                <Appbar.Action icon="delete" onPress={() => onDeleteNote()} />
            </Appbar.Header>


            <Container>
                <Card style={{ height: '95%', borderRadius: 5, paddingTop: 5, backgroundColor: theme.PRIMARY_CONTAINER_BACKGROUND_COLOR, margin: 10 }}>

                    <Date>
                        <Paragraph style={{ fontSize: 18, color: theme.PRIMARY_TEXT_COLOR }}>{Math.floor(note.date % 100000000 / 1000000)}/{Math.floor(note.date % 10000000000 / 100000000)}/{Math.floor(note.date % 1000000000000 / 10000000000)}</Paragraph>
                        <Paragraph style={{ fontSize: 18, color: theme.PRIMARY_TEXT_COLOR }}>{Math.floor(note.date % 1000000 / 10000)}:{Math.floor(note.date % 10000 / 100) < 10 ? "0" : ""}{Math.floor(note.date % 10000 / 100)}</Paragraph>
                    </Date>

                    {isImageNotNull()}

                    <ScrollView>
                        <Card.Content style={{}}>
                            <Title style={{ color: theme.PRIMARY_TEXT_COLOR, textAlign: 'justify', paddingBottom: 10, marginBottom: 15, fontSize: 19, }}>"{note.title}"</Title>
                            <Paragraph style={{ color: theme.PRIMARY_TEXT_COLOR, fontSize: 17, textAlign: "justify", borderTopColor: 'gray', paddingBottom: 10, paddingTop: 15, borderTopWidth: 2, marginTop: -20 }}>{note.description}</Paragraph>
                        </Card.Content>
                    </ScrollView>

                </Card>
            </Container>


        </ThemeProvider>
    )
}

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
  padding-top: 20px;
  padding-horizontal: 10px;
 
  `;

const Date = styled.View`
    flex-direction: row; 
    justify-content: space-between;  
    padding-top: 10px;
    padding-left: 10px;    
    padding-right: 10px;
    padding-bottom: 5px; 
`;


export default OpenNote