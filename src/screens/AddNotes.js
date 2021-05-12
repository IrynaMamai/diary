import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text, IconButton, TextInput, FAB, Appbar, Title, Portal, Modal, Card, Button, Paragraph, Dialog, Provider } from 'react-native-paper'

import { useSelector } from 'react-redux'
import styled, { ThemeProvider } from "styled-components"

import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker'
import NetInfo from "@react-native-community/netinfo";

import { useTranslation } from 'react-i18next'
import '../translete/i18n'


function AddNotes({ navigation }) {
    const { t , i18n} = useTranslation();

    const theme = useSelector((state) => state.themeReducer.theme)

    ///Notes information 
    const note = navigation.getParam('note');

    const [noteTitle, setNoteTitle] = useState(note ? note.title : "")
    const [noteDescription, setNoteDescription] = useState(note ? note.description : "")
    const [inputURL, setURL] = useState("")

    const [conected, setConected] = React.useState(false);
    const showDialogConected = () => {
        setConected(true);
        hideImage();
    }
    const hideDialogConected = () => setConected(false);

    //Image source
    const [image, setImage] = React.useState(note ? { localUri: note.url } : "");
    const [isOpen, setOpen] = React.useState(false);
    const showImage = () => setOpen(true);
    const hideImage = () => setVisible(false);

    ///Dialog
    const [visible, setVisible] = React.useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);


    async function download(url) {
        NetInfo.fetch().then(async info => {
            if (info.isConnected) {
                hideDialogConected();

                const name = url + ".png"
                try {
                    let { uri: localUri } = await FileSystem.downloadAsync(url, FileSystem.documentDirectory + 'diary.png');

                    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
                    if (status === "granted") {
                        const asset = await MediaLibrary.createAssetAsync(localUri)
                        await MediaLibrary.createAlbumAsync("Diary", asset, false)
                    }

                    setURL("");
                    hideDialog();

                    setImage({ localUri: localUri });

                } catch {
                    console.log("Error download")
                }
            } else {
                showDialogConected();
            }
        });

    }

    async function openImage() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === "granted") {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.cancelled) {
                setImage({ localUri: result.uri });
                showImage();
            }
        }
    }

    async function openCamera() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status === "granted") {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });



            if (!result.cancelled) {
                const asset = await MediaLibrary.createAssetAsync(result.uri)
                await MediaLibrary.createAlbumAsync("Diary", asset, false)

                setImage({ localUri: result.uri });
                showImage();
            }
        }
    }

    function onSaveNote() {
        if (note) {
            note.title = noteTitle;
            note.description = noteDescription;
            note.url = image.localUri;
            navigation.state.params.editNote({ note })
            navigation.goBack()
        }

        else {
            const url = image.localUri
            navigation.state.params.addNote({ url, noteTitle, noteDescription })

            navigation.goBack()

        }
    }

    const isImageNotNull = () => {
        if (image.localUri) {
            return (

                <Card visible={isOpen}>
                    <Card.Cover style={{resizeMode: "cover"}} source={{ uri: image.localUri }} />
                </Card>


            )
        }
    }

    return (
        <Provider>
            <ThemeProvider theme={theme}>
                <Appbar.Header style={{ backgroundColor: theme.PRIMARY_HEADER_COLOR }}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title={t("~ add note ~")} />
                    <Appbar.Action icon="download-network" onPress={() => showDialog()} />
                    <Appbar.Action icon="folder-image" onPress={() => openImage()} />
                    <Appbar.Action icon="camera" onPress={() => openCamera()} />
                </Appbar.Header>



                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog} style={{backgroundColor: theme.PRIMARY_BACKGROUND_COLOR}}>
                        <Dialog.Content>
                            <TextInput
                                label={t("Add URL here")}
                                value={inputURL}
                                mode='outlined'
                                onChangeText={setURL}
                                style={{backgroundColor: theme.PRIMARY_CONTAINER_BACKGROUND_COLOR}}
                                theme={{ colors: {primary: theme.PRIMARY_BORDER_INPUT_COLOR, placeholder: theme.PRIMARY_TEXT_COLOR, text: theme.PRIMARY_TEXT_COLOR, }}}

                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <TouchableOpacity style={{padding: 5}} onPress={() => download(inputURL)}><Text style={{color: theme.PRIMARY_BORDER_INPUT_COLOR  }}>{t("Done")}</Text></TouchableOpacity>
                        </Dialog.Actions>
                    </Dialog>


                    <Modal visible={conected} onDismiss={hideDialogConected} contentContainerStyle={{ backgroundColor: theme.PRIMARY_CONTAINER_BACKGROUND_COLOR, padding: 20, margin: 20}}>
                        <Text style={{color: theme.PRIMARY_TEXT_COLOR}}>{t("No network connection. Check connection")}</Text>
                    </Modal>
                </Portal>

                {isImageNotNull()}


                <Container>
                    <TextInput
                        label={t("Title")}
                        value={noteTitle}
                        onChangeText={setNoteTitle}
                        style={{ backgroundColor: theme.PRIMARY_CONTAINER_BACKGROUND_COLOR, fontSize: 20,}}
                        theme={{ colors: { primary: theme.PRIMARY_BORDER_INPUT_COLOR, placeholder: theme.PRIMARY_TEXT_COLOR, text: theme.PRIMARY_TEXT_COLOR,  } }}
                    />
                    <TextInput
                        label={t("Description")}
                        value={noteDescription}
                        onChangeText={setNoteDescription}
                        multiline={true}
                        style={{backgroundColor: theme.PRIMARY_CONTAINER_BACKGROUND_COLOR, fontSize: 18, height: 250, colors: 'white'}}
                        scrollEnabled={true}
                        returnKeyLabel='done'
                        blurOnSubmit={true}
                        theme={{ colors: { primary: theme.PRIMARY_BORDER_INPUT_COLOR, placeholder: theme.PRIMARY_TEXT_COLOR, text: theme.PRIMARY_TEXT_COLOR,  }, color: 'white' }}
                    />
                    <FAB
                        style={{ backgroundColor: theme.PRIMARY_BUTTON_COLOR, position: 'absolute', margin: 20, right: 0, bottom: 10 }}                       
                        small
                        icon="check"
                        disabled={noteTitle == '' ? true : false}
                        onPress={() => onSaveNote()}
                    />
                </Container>
            </ThemeProvider>
        </Provider>
    )
}


const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
  padding-vertical: 20px;
  padding-horizontal: 10px;
  `;

const styles = StyleSheet.create({

 
    noteTitle: {
        backgroundColor: '#FAF3DD',
        fontSize: 20,
    },

  
    text: {
        backgroundColor: '#FAF3DD',
        fontSize: 18,
        height: 250
    },

  
  



})

export default AddNotes