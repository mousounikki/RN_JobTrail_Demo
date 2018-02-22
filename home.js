import React, {Component} from 'react';
import {StyleSheet, Dimensions, TouchableHighlight, Image, Alert,View} from 'react-native';
import {
	Container,
	Header,
	InputGroup,
	Icon,
	Input,
	Button,
	Content,
	List,
	ListItem,
	Thumbnail,
	Text
} from 'native-base';

import Swiper from 'react-native-swiper';
import Detail from './detail';


const SERVER_URL ='http://117.27.141.20:3000/';
const TASK_API ='tasks/';

export default class home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			swiperShow:false,
			searchText: '',
			advertisements: [
				{
					image: require('./images/advertisement-image-01.jpg')
				}, {
					image: require('./images/advertisement-image-02.jpg')
				}, {
					image: require('./images/advertisement-image-03.jpg')
				}
			],
			tasks: [],
		};
	}

    //组件渲染完毕时调用此方法
	componentDidMount(){  //组件生命周期回调函数
		this._fetchTask();
    	setTimeout(()=>{  //判断ListView数据加载完成后再启用Swiper，否则有滑动冲突
        	this.setState({
            	swiperShow:true
        	});
    	},0);
	}

	render() {
	    if(this.state.swiperShow){ 
			return (
				<Container>
					<Header searchBar rounded>
						<InputGroup>
							<Icon name='ios-search-outline'/>
							<Input
								placeholder='搜索任务'
								onChangeText={(text) => {
								this.setState({searchText: text});
								console.log('输入的内容是 ' + this.state.searchText);
							}}/>
						</InputGroup>
						<Button
							transparent
							onPress={() => {
							Alert.alert('搜索内容 ' + this.state.searchText, null, null);
						}}>搜索</Button>
					</Header>
					<Content>
						<Swiper
							removeClippedSubviews={false} 
						    loop={true}
						    height={200}
						    autoplay={true}
						    showsPagination={false}>
							{this.state.advertisements.map((advertisement, index) => {
								return (
									<TouchableHighlight
										key={index}
										onPress={() => Alert.alert('你点击了轮播图', null, null)}>
										<Image style={styles.advertisementContent} source={advertisement.image}></Image>
									</TouchableHighlight>
								);
							})}
						</Swiper>
						<List dataArray={this.state.tasks} renderRow={this._renderRow}></List>
					</Content>
				</Container>
			)
	    }else{
	        return (
	            <View style={{height:100}}>
	            </View>
	        );
	    	}
	}

	_fetchTask = () => {

		const req = new Request(SERVER_URL + TASK_API ,{method:'GET'});
		console.log('request:',SERVER_URL + TASK_API);
		fetch(req).then((res) => {
			return res.json();
		}).then((result,done) => {
			if (!done){
				this.setState({tasks:result});
			}
		});
	}

	_renderRow = (task) => {
		return (
			<ListItem
				button
				onPress={() => {
				const {navigator} = this.props;
				if (navigator) {
					navigator.push({
						name: 'detail',
						component: Detail,
						params: {
							task:task,
							taskUpdated:this._taskUpdated
						}
					});
				}
			}}>
				<Thumbnail square size={40} source={{
					uri: SERVER_URL + task.image
			    }}/>
				<Text>{task.title}</Text>
				<Text note>{task.subTitle}</Text>
			</ListItem>
		);
	}

	_taskUpdated = () =>{
		this._fetchTask();
	}

	renderSwiper = () =>{
    	if(this.state.swiperShow){
        	return (
            	<Swiper height={150} autoplay={true} activeDotColor="#fff">
                		{BANNER_LIST.map((item, i) => {
                    return <Image/>;
           	     })}
            	</Swiper>
        	);
    	}else {
        	return <View style={{height:150}}></View>;
    		}
	}	
}




const styles = StyleSheet.create({
	advertisementContent: {		
		width: Dimensions.get('window').width,
		height:Dimensions.get('window').width / 2.0,
	}
});
