import React, { Component } from 'react';
import { Card ,Button } from 'antd';
import { connect } from 'dva';

const namespace = 'puzzlecards';

// state 发生改变 触发该函数 该函数返回新状态 直接导致页面刷新
const mapStateToProps = (state) => {
  const cardList = state[namespace].data;
  console.log('mapStateToProps 1');
  return {
    cardList,
  };
};

// 熟悉触发器
const mapDispatchToProps = (dispatch) => {
  return {
    onClickAdd: (newCard) => {
        console.log('onClickAdd 1',newCard);
      const action = {
        //  触发类型
        type: `${namespace}/addNewCard`,
        // 数据 payload 
        payload: newCard,
      };
      dispatch(action);
    },
  };
};

// 把状态和属性连接起来
@connect(mapStateToProps, mapDispatchToProps)
export default class PuzzleCardsPage extends Component {
  render() {
    return (
      <div>
        {
          this.props.cardList.map(card => {
            return (
              <Card key={card.id}>
                <div>Q: {card.setup}</div>
                <div>
                  <strong>A: {card.punchline}</strong>
                </div>
              </Card>
            );
          })
        }
        <div>
          <Button onClick={() => this.props.onClickAdd({
            setup: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            punchline: 'here we use dva',
          })}> 添加卡片 </Button>
        </div>
      </div>
    );
  }
}