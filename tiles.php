<?php


class Tiles{
    /**
    * $uid
    * @var int
    */
    protected $uid = '';
    /**
    * $type
    * @var string
    */
    protected $type = '';
    /**
    * $color
    * @var string
    */
    protected $color = '';
    /**
    * $source
    * @var string
    */
    protected $source = '';
    /**
    * $collision
    * @var boolean
    */
    protected $collision = '';
    /**
    * $offsetTop
    * @var int
    */
    protected $offsetTop = '';
    /**
    * $offsetRight
    * @var int
    */
    protected $offsetRight = '';
    /**
    * $offsetLeft
    * @var int
    */
    protected $offsetLeft = '';
    /**
    * $offsetBottom
    * @var int
    */
    protected $offsetBottom = '';



    function __construct($bla){
        var_dump($bla);
    }

    /**
     * Get the value of $uid
     *
     * @return int
     */
    public function getUid()
    {
        return $this->uid;
    }

    /**
     * Set the value of $uid
     *
     * @param int $uid
     *
     * @return self
     */
    public function setUid($uid)
    {
        $this->uid = $uid;

        return $this;
    }

    /**
     * Get the value of $type
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set the value of $type
     *
     * @param string $type
     *
     * @return self
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get the value of $color
     *
     * @return string
     */
    public function getColor()
    {
        return $this->color;
    }

    /**
     * Set the value of $color
     *
     * @param string $color
     *
     * @return self
     */
    public function setColor($color)
    {
        $this->color = $color;

        return $this;
    }

    /**
     * Get the value of $source
     *
     * @return string
     */
    public function getSource()
    {
        return $this->source;
    }

    /**
     * Set the value of $source
     *
     * @param string $source
     *
     * @return self
     */
    public function setSource($source)
    {
        $this->source = $source;

        return $this;
    }

    /**
     * Get the value of $collision
     *
     * @return boolean
     */
    public function getCollision()
    {
        return $this->collision;
    }

    /**
     * Set the value of $collision
     *
     * @param boolean $collision
     *
     * @return self
     */
    public function setCollision($collision)
    {
        $this->collision = $collision;

        return $this;
    }

    /**
     * Get the value of $offsetTop
     *
     * @return int
     */
    public function getOffsetTop()
    {
        return $this->offsetTop;
    }

    /**
     * Set the value of $offsetTop
     *
     * @param int $offsetTop
     *
     * @return self
     */
    public function setOffsetTop($offsetTop)
    {
        $this->offsetTop = $offsetTop;

        return $this;
    }

    /**
     * Get the value of $offsetRight
     *
     * @return int
     */
    public function getOffsetRight()
    {
        return $this->offsetRight;
    }

    /**
     * Set the value of $offsetRight
     *
     * @param int $offsetRight
     *
     * @return self
     */
    public function setOffsetRight($offsetRight)
    {
        $this->offsetRight = $offsetRight;

        return $this;
    }

    /**
     * Get the value of $offsetLeft
     *
     * @return int
     */
    public function getOffsetLeft()
    {
        return $this->offsetLeft;
    }

    /**
     * Set the value of $offsetLeft
     *
     * @param int $offsetLeft
     *
     * @return self
     */
    public function setOffsetLeft($offsetLeft)
    {
        $this->offsetLeft = $offsetLeft;

        return $this;
    }

    /**
     * Get the value of $offsetBottom
     *
     * @return int
     */
    public function getOffsetBottom()
    {
        return $this->offsetBottom;
    }

    /**
     * Set the value of $offsetBottom
     *
     * @param int $offsetBottom
     *
     * @return self
     */
    public function setOffsetBottom($offsetBottom)
    {
        $this->offsetBottom = $offsetBottom;

        return $this;
    }

}


?>
