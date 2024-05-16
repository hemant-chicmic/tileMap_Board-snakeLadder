import { _decorator, Button, Color, Component, director, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, TiledLayer, TiledMap, TiledTile, tween, Tween, UITransform, Vec3 } from 'cc';
import {gamePlayScene , tiledMapLayerName} from './constants'


const { ccclass, property } = _decorator;


@ccclass('gameplay')
export class gameplay extends Component {


    @property( {type : Node } )
    addCellNumbers : Node | null = null ;


    @property( {type : Prefab } )
    cellNumPrefab : Prefab | null = null ;

    @property( {type : Node } )
    player1Img : Node | null = null ;
    @property( {type : Node } )
    player2Img : Node | null = null ;


    @property({ type: [SpriteFrame] })
    diceImgArray: SpriteFrame[] = [];
    @property({ type: Node })
    diceImg: Node | null = null;
    @property({ type: Button })
    rollDiceButton: Button | null = null;


    private cellNodesMap: Map<string, Node> = new Map();
    private player1CurrCell: number = 0;
    private player2CurrCell: number = 0;







    start() 
    {
        console.log( " player1Img  " , this.player1Img.position.x , " " , this.player1Img.position.y ) ;
        // this.player1Img.setPosition(new Vec3(250 , 600, 0)) ;
        console.log("Start tiled map", this.node);
        let tiledMap = this.node.getComponent(TiledMap);
        console.log(" blank board TiledMap:", tiledMap);
        let layer = tiledMap.getLayer(tiledMapLayerName);
        console.log("boardSkeleton Layer   ", layer  );
        let layerSize = layer.getLayerSize() ;
        for(let i =0; i<layerSize.width; i++)
        {
            for(let j =0; j<layerSize.height; j++)
            {
                let tile: TiledTile = layer.getTiledTileAt(9-j , i, true);
                let tileWidth = layer.getMapTileSize().width ;
                let tileHeight = layer.getMapTileSize().width ;
                let tileLocalPosistion = layer.getPositionAt(9-j , i ) ;
                // console.log( "tile " , tileWidth , tileHeight ) ;

                let boardbasePosition = this.node.getPosition() ;
                let boardbaseWidth = this.node.getComponent(UITransform).width ;
                let boardbaseHeight = this.node.getComponent(UITransform).height ;
                let tileWorldPositionX = boardbasePosition.x - boardbaseWidth/2 + tileLocalPosistion.x + tileWidth/2 ;
                let tileWorldPositionY = boardbasePosition.y - boardbaseHeight/2 + tileLocalPosistion.y + tileHeight/2 ;
                let tileWorldPosition = new Vec3( tileWorldPositionX , tileWorldPositionY , 0  ) ; 

                // let tileWorldPosition = tile.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(tileLocalPosistion.x , tileLocalPosistion.y , 0)) 
                // let tilePositionToCanvas = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(tileWorldPosition) ;
                // console.log( "tiletile " , tileLocalPosistion , "  world " , tileWorldPosition  , "can " , tilePositionToCanvas) ;
                let newCellNumber = instantiate(this.cellNumPrefab) ;
                let newCellNumberLabel = newCellNumber.getComponent(Label) ;
                newCellNumberLabel.string = `${100 - (i) * 10 - ( i % 2 == 1 ? j : 9-j ) }` ;
                newCellNumber.setPosition(tileWorldPosition) ;
                this.addCellNumbers.addChild(newCellNumber) ;
                this.cellNodesMap.set( `${100 - (i) * 10 - ( i % 2 == 1 ? j : 9-j ) }` , newCellNumber);
            }
            // break ;
        }
        
    }



    RollDiceRandomaly() {
        let randomNumber = Math.floor(Math.random() * 6) + 1;
        this.diceImg.getComponent(Sprite).spriteFrame = this.diceImgArray[randomNumber - 1];
        this.playerTweenAnimation(this.player1Img , this.player1CurrCell+1 , this.player1CurrCell+ randomNumber , 1 ) ;
    }

    playerTweenAnimation(playerImg: Node, nextCell: number, finalCell: number, playerindex: number) {
        let playerCurrPositionX = playerImg.position.x;
        let playerCurrPositionY = playerImg.position.y;
        let NextCellPosition = this.cellNodesMap.get(nextCell.toString()).position ;
        let NextCellPositionX = NextCellPosition.x;
        let NextCellPositionY = NextCellPosition.y;
    
        console.log( " img " , nextCell ) ;
        
        tween(playerImg)
            .to(0.2, { position: new Vec3(playerCurrPositionX, playerCurrPositionY + 20) })
            .to(0.2, { position: new Vec3(NextCellPositionX, NextCellPositionY + 20) })
            .to(0.2, { position: NextCellPosition }, { 
                easing: "quadIn",
                onComplete: () => {
                    if (nextCell == finalCell && finalCell == 100) {
                        Tween.stopAll();
                        window.alert(`Player ${playerindex} is winner`);
                        window.alert('Play Again');
                        director.loadScene(gamePlayScene);
                    }
                    if (nextCell == finalCell ) {
                        if (playerindex == 1) 
                            this.player1CurrCell = finalCell ;
                        else 
                            this.player2CurrCell = finalCell ;
                        return ;
                    }
                    this.playerTweenAnimation(playerImg, nextCell + 1, finalCell, playerindex);
                },
            })
            .start();
    }





    

    update(deltaTime: number) {
        
    }
}

