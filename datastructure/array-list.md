**contents**

- [장점](#장점)
- [단점](#단점)
- [장점](#장점)
- [단점](#단점)
- [ArrayList](#arraylist)
  - [배열과 ArrayList의 차이](#배열과-arraylist의-차이)
- [LinkedList](#linkedlist)
- [Vector](#vector)
- [노드 삽입 과정 비교](#노드-삽입-과정-비교)

# Array(배열)

- 여러 데이터를 하나의 이름으로 그룹핑해서 관리 하기 위한 자료구조. `index`와 값의 쌍으로 구성
- index는 값에 대한 **유일무이한 식별자**(마치 주민번호)( 리스트에서 인덱스는 몇 번째 데이터인가 정도의 의미를 가짐)
- 논리적 저장 순서와 물리적 저장 순서가 일치 => index로 해당 원소에 접근할 수 있다. (`O(1)`)
- 연속된 메모리의 공간으로 이루어져 있다
- 배열은 정의와 동시에 길이를 지정하며 길이를 바꿀 수 없다.

### 장점

- 인덱스를 통한 검색이 용이함.
- 연속적이므로 메모리 관리가 편하다.

### 단점

- 크기가 고정되어 있기 때문에 어떤 엘리먼트가 삭제되면, 삭제된 상태를 빈 공간으로 남겨두어야 한다. => `메모리 낭비`
- 정적이므로 배열의 크기를 컴파일 이전에 정해주어야 한다.
- 컴파일 이후 배열의 크기를 변동 할 수 없다.

# List

- 리스트는 순서가 있는 엘리먼트의 모임으로 배열과는 다르게 빈 엘리먼트는 절대 허용하지 않는다.
- 리스트는 배열이 가지고 있는 인덱스라는 장점을 버리고 대신 **빈틈없는 데이터의 적재** 라는 장점을 취함
- 리스트에서 인덱스는 몇 번째 데이터인가 정도(순서)의 의미를 가진다. (배열-Array에서의 인덱스는 값에 대한 유일무이한 식별자)
- 빈 엘리먼트는 허용하지 않는다. => java에서는 허용하는 경우가 있음
- 순차성을 보장하지 못하기 때문에 spacial locality 보장이 되지 않아서 cash hit가 어렵다.(데이터 갯수가 확실하게 정해져 있고, 자주 사용된다면 array가 더 효율적이다.)
- 불연속적으로 메모리 공간을 차지.
- 포인터를 통한 접근

### 장점

- 포인터를 통하여 다음 데이터의 위치를 가르켜고 있어 삽입 삭제의 용이.
- 동적이므로 크기가 정해져 있지 않다.
- 메모리의 재사용 편리
- 불연속적이므로 메모리 관리의 편리

### 단점

- 검색 성능이 좋지 않다.
- 포인터를 통해 다음 데이터를 가르키므로 추가적인 메모리 공간 발생.

|       | 추가/삭제 | 조회 |
| ----- | --------- | ---- |
| Array | 느림      | 빠름 |
| List  | 빠름      | 느림 |

- 배열 : 데이터의 크기가 정해져 있고, 추가적인 삽입 삭제가 일어 나지 않으며 검색을 필요로 할 때 유리.
- 리스트 : 데이터의 크기가 정해져 있지 않고, 삽입 삭제가 많이 일어나며, 검색이 적은 경우 유리.

---

# Java List Collection

List는 Collection 인터페이스를 확장한 자료형으로 동일한 데이터의 중복 입력이 가능하며 순차적이고 다량의 데이터를 입력할 때 주로 사용합니다. 종류는 Vector, Arraylist, Linkedlist가 있습니다.

## ArrayList

일반 배열과 ArrayList는 인덱스로 객체를 관리한다는 점에서 동일하지만, 크기를 동적으로 늘릴 수 있다는 점에서 차이점이 있다.ArrayList는 내부에서 처음 설정한 저장 용량(capacity)가 있다. 설정한 저장 용량 크기를 넘어서 더 많은 객체가 들어오게 되면, 배열 크기를 **1.5배**로 증가시킴

```
// DEFAULT_CAPACITY=10
// 기본 저장용량 10으로 리스트 생성
List<String> list = new ArrayList<>();

// 저장 용량을 100으로 설정해 ArrayList 생성
List<String> list = new ArrayList<>(100);
```

ArrayList에서 특정 인덱스의 객체를 제거하게 되면, 제거한 객체의 인덱스부터 마지막 인덱스까지 모두 앞으로 1칸씩 앞으로 이동한다. 객체를 추가하게 되면 1칸씩 뒤로 이동하게 된다. 인덱스 값을 유지하기 위해서 전체 객체가 위치가 이동한다.
따라서 잦은 원소의 이동, 삭제가 발생할 경우 ArrayList보다 LinkedList를 사용하는 것이 좋다.

### 배열과 ArrayList의 차이

- 배열은 크기가 고정되어있지만 arrayList는 사이즈가 동적인 배열이다.
- 배열은 primitive type(int, byte, char 등)과 object 모두를 담을 수 있지만, arrayList는 object element만 담을 수 있다.
- 배열은 제네릭을 사용할 수 없지만, arrayList는 타입 안정성을 보장해주는 제네릭을 사용할 수 있다.
- 길이에 대해 배열은 length 변수를 쓰고, arrayList는 size() 메서드를 써야한다.
- 배열은 element들을 할당하기 위해 assignment(할당) 연산자를 써야하고, arrayList는 add() 메서드를 통해 element를 삽입한다.

```java
// ArrayList.class

private Object[] grow(int minCapacity) {
        // newCapacity 길이의 새 배열에 기존 배열 복사
        return this.elementData = Arrays.copyOf(this.elementData, this.newCapacity(minCapacity));
    }

 private int newCapacity(int minCapacity) {
        int oldCapacity = this.elementData.length;
        // 기존 리스트 길이 + (기존리스트길이/2)
        // 길이가 부족할 경우 1.5배 길이를 늘린다
        int newCapacity = oldCapacity + (oldCapacity >> 1);
        if (newCapacity - minCapacity <= 0) {
            if (this.elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
                return Math.max(10, minCapacity);
            } else if (minCapacity < 0) {
                throw new OutOfMemoryError();
            } else {
                return minCapacity;
            }
        } else {
            return newCapacity - 2147483639 <= 0 ? newCapacity : hugeCapacity(minCapacity);
        }
    }
```

## LinkedList

노드 간에 연결(link)을 통해서 리스트로 구현된 객체이다. 다음 노드의 위치 정보만 가지고 있으며 **인덱스를 가지고 있지 않기 때문에** 탐색시 `순차접근`만 가능 (노트 탐색 시 시간이 많이 소요될 수 있음)
노드 추가/삭제는 위치정보의 수정만으로 가능하기 때문에 성능이 좋음

## Vector

Vector는 ArrayList와 동일한 내부 구조를 가지고 있다. Vector 객체를 생성하기 위해서는 저장할 타입을 지정해야 한다.
ArrayList와 차이점으로는 Vector 클래스는 `동기화된(synchronized)` 메서드로 구성되어 있다. 그렇기 때문에 멀티 스레드 환경에서 안전하게 객체를 추가, 삭제할 수 있다.(Thread Safe)
다만 동기화되어 있기 때문에 ArrayList 보다는 객체를 추가, 삭제하는 과정은 느릴수 밖에 없다.(trade off)
데이터 추가 시 공간이 부족한 경우 배열 크기를 2배로 증가시킨다.

## 노드 삽입 과정 비교

- Arraylist, Vector
  ![](https://images.velog.io/images/adam2/post/d076d376-72fa-4fba-bd5f-a7360f4ea65e/image.png)
- LinkedList :: 노드 생성 후 주소값만 변경
  ![](https://images.velog.io/images/adam2/post/78140e83-4789-4e09-9a4e-e354dbee80a7/image.png)

ArrayList : 객체 검색, 맨 마지막 인덱스에 객체 추가에 좋은 성능을 발휘함
LinkedList : 객체 삽입 및 삭제에 좋은 성능을 발휘함
Vector: 멀티스레드 환경에서 사용

---

참고
https://cupjoo.tistory.com/44 [오지는 컴퓨터 공부]
https://wayhome25.github.io/cs/2017/04/17/cs-18-1/
[https://changun516.tistory.com/9](https://changun516.tistory.com/9)
https://lelecoder.com/78
[https://17billion.github.io/java/2017/06/18/java_collection_vector_arraylist_linkedlist.html](https://17billion.github.io/java/2017/06/18/java_collection_vector_arraylist_linkedlist.html)
https://zorba91.tistory.com/287
